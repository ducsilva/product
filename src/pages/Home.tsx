import { Box, Typography } from "@mui/material";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import BoxItem from "components/BoxItem";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
  type MRT_Virtualizer,
} from "material-react-table";
import {
  UIEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  DEFAULT_SIZE,
  URL_INSTANCE,
  URL_INSTANCE_SEARCH,
  UserApiResponse,
} from "utils/index";

const columns: MRT_ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Product Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "price",
    header: "Price",
    Cell: ({ cell }) => {
      return <h5>{`${cell?.renderValue()}$`}</h5>;
    },
  },
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    Cell: ({ cell }) => {
      return (
        <BoxItem>
          <img src={`${cell?.renderValue()}`} width={100} height={100} alt="" />
        </BoxItem>
      );
    },
  },
];

const Home = () => {
  const navigate = useNavigate();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef =
    useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery<UserApiResponse>({
      queryKey: ["table-data", columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam = 0 }) => {
        const url = new URL(globalFilter ? URL_INSTANCE_SEARCH : URL_INSTANCE);
        url.searchParams.set("q", globalFilter ?? "");
        url.searchParams.set("skip", `${pageParam * DEFAULT_SIZE}`);
        url.searchParams.set("limit", `${DEFAULT_SIZE}`);
        url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
        const response = await fetch(url.href);
        const json = (await response.json()) as UserApiResponse;
        return json;
      },
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page: any) => page?.products) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.total ?? 0;
  const totalFetched = flatData?.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <MaterialReactTable
      columns={columns}
      data={flatData?.length ? flatData : []}
      enablePagination={false}
      enableRowNumbers
      enableRowVirtualization
      manualFiltering
      manualSorting
      muiTableContainerProps={{
        ref: tableContainerRef,
        sx: { maxHeight: "600px" },
        onScroll: (event: UIEvent<HTMLDivElement>) =>
          fetchMoreOnBottomReached(event.target as HTMLDivElement),
      }}
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: "error",
              children: "Error loading data",
            }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      renderBottomToolbarCustomActions={() => (
        <Typography>
          Fetched {totalFetched} of {totalDBRowCount} total rows.
        </Typography>
      )}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef}
      rowVirtualizerProps={{ overscan: 4 }}
      muiTableBodyRowProps={({ row }) => {
        return {
          onClick: () => {
            navigate(`/product/${row?.original?.id}`);
          },
          sx: {
            cursor: "pointer",
          },
        };
      }}
    />
  );
};

const queryClient = new QueryClient();

const HomePage = () => (
  <QueryClientProvider client={queryClient}>
    <Box sx={{ p: 2 }}>
      <Home />
    </Box>
  </QueryClientProvider>
);

export default HomePage;
