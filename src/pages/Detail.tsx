import { Box, ImageList, ImageListItem } from "@mui/material";
import BoxItem from "components/BoxItem";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product, URL_INSTANCE } from "utils";

const Detail = () => {
  const { productId } = useParams();
  const [productItem, setProductItem] = useState<Product>();

  const initData = async (id: any) => {
    const url = new URL(URL_INSTANCE);
    if (id) {
      const response = await fetch(`${url.href}/${id}`);
      const json = await response.json();
      setProductItem(json);
    }
  };

  useEffect(() => {
    initData(productId);
  }, [productId]);

  return (
    <Box
      sx={{
        p: 4,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
        }}
      >
        <h1>{productItem?.title}</h1>
      </Box>
      <div style={{ width: "100%" }}>
        <h4>Image Thumbnail</h4>
        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: "repeat(2, 1fr)",
          }}
        >
          <Box>
            <BoxItem>
              <ImageListItem>
                <img
                  src={`${productItem?.thumbnail}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${productItem?.thumbnail}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={productItem?.thumbnail}
                  loading="lazy"
                />
              </ImageListItem>
            </BoxItem>
          </Box>
          <Box>
            <h5>Brand: {productItem?.brand}</h5>
            <h5>Description: {productItem?.description}</h5>
            <h5>Category: {productItem?.category}</h5>
            <h5>Rating: {productItem?.rating}</h5>
            <h5>In Stock: {productItem?.stock}</h5>
            <h5>Price: {productItem?.price} $</h5>
            <h5>Discount: {productItem?.discountPercentage} %</h5>
          </Box>
        </Box>
      </div>

      <Box
        sx={{
          textAlign: "start",
        }}
      >
        <h4>Image List</h4>
      </Box>
      {productItem?.images?.length && (
        <ImageList sx={{ width: "100%", height: 500 }} gap={10}>
          {productItem?.images?.map((item) => (
            <BoxItem key={item}>
              <ImageListItem
                sx={{
                  width: 500,
                  height: 500,
                }}
              >
                <img
                  src={`${item}?w=164&h=164&fit=crop&auto=format`}
                  srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={item}
                  loading="lazy"
                />
              </ImageListItem>
            </BoxItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default Detail;
