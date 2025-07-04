import React from 'react';
import styled from 'styled-components';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../types/Product';
import { colors, Card, Button, Badge, Flex, Text } from '../styles/GlobalStyles';

const ProductCardWrapper = styled(Card)`
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
  border-radius: 12px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.imageUrl});
  background-size: cover;
  background-position: center;
  background-color: ${colors.light};
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  border-radius: 12px 12px 0 0;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 70%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, ${colors.light} 0%, #e2e8f0 100%);
  margin: -1.5rem -1.5rem 1rem -1.5rem;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.textLight};
  font-size: 0.875rem;
`;

const ProductInfo = styled.div`
  padding: 0;
`;

const ProductHeader = styled.div`
  margin-bottom: 0.75rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${colors.dark};
  margin-bottom: 0.25rem;
  line-height: 1.3;
`;

const ProductBrand = styled.p`
  font-size: 0.875rem;
  color: ${colors.textLight};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: ${colors.text};
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductDetails = styled.div`
  margin-bottom: 1rem;
`;

const ProductSize = styled.span`
  font-size: 0.875rem;
  color: ${colors.textLight};
  background-color: ${colors.light};
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-weight: 500;
`;

const PriceSection = styled.div`
  margin-bottom: 1rem;
`;

const Price = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primary};
`;

const ActionButtons = styled(Flex)`
  gap: 0.5rem;
`;

const ViewButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const AddToCartButton = styled(Button)`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onAddToCart,
}) => {
  const handleView = () => {
    onView?.(product);
  };

  const handleAddToCart = () => {
    if (product.inStock) {
      onAddToCart?.(product);
    }
  };

  return (
    <ProductCardWrapper>
      {product.imageUrl ? (
        <ProductImage imageUrl={product.imageUrl} />
      ) : (
        <ImagePlaceholder>No Image Available</ImagePlaceholder>
      )}
      
      <ProductInfo>
        <ProductHeader>
          <Flex justify="between" align="start" gap="0.5rem">
            <div style={{ flex: 1 }}>
              <ProductName>{product.name}</ProductName>
              <ProductBrand>{product.brand}</ProductBrand>
            </div>
            <Badge variant={product.inStock ? 'success' : 'danger'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </Badge>
          </Flex>
        </ProductHeader>

        <ProductDescription>{product.description}</ProductDescription>

        <ProductDetails>
          <Text size="sm" color={colors.textLight}>Size:</Text>
          <ProductSize>{product.size}</ProductSize>
        </ProductDetails>

        <PriceSection>
          <Price>${product.price.toFixed(2)}</Price>
        </PriceSection>

        <ActionButtons>
          <ViewButton variant="secondary" onClick={handleView}>
            <Eye size={16} />
            View
          </ViewButton>
          <AddToCartButton
            variant={product.inStock ? 'primary' : 'secondary'}
            disabled={!product.inStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </AddToCartButton>
        </ActionButtons>
      </ProductInfo>
    </ProductCardWrapper>
  );
};