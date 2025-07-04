import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Filter, Loader } from 'lucide-react';
import { Product } from '../types/Product';
import { ApiService } from '../services/api';
import { ProductCard } from './ProductCard';
import {
  Container,
  PageTitle,
  Grid,
  Input,
  Button,
  Flex,
  Text,
  colors,
  Card
} from '../styles/GlobalStyles';

const ShopWrapper = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
`;

const SearchBar = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const SearchInput = styled(Input)`
  padding-left: 3rem;
  font-size: 1.125rem;
  height: 3rem;
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.textLight};
`;

const FilterSection = styled(Card)`
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
`;

const FilterGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${colors.text};
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${colors.white};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    outline: none;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  gap: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const ProductGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ResultsHeader = styled(Flex)`
  margin-bottom: 1.5rem;
  align-items: center;
  gap: 1rem;
`;

export const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when search term or filters change
  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, brandFilter, stockFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term) ||
          product.size.toLowerCase().includes(term)
      );
    }

    // Filter by brand
    if (brandFilter) {
      filtered = filtered.filter(product => product.brand === brandFilter);
    }

    // Filter by stock status
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(product => product.inStock);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(product => !product.inStock);
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setBrandFilter('');
    setStockFilter('');
  };

  const handleProductView = (product: Product) => {
    // In a real app, this would navigate to a product detail page
    alert(`Viewing ${product.name} - ${product.brand}`);
  };

  const handleAddToCart = (product: Product) => {
    // In a real app, this would add the product to the shopping cart
    alert(`Added ${product.name} to cart!`);
  };

  // Get unique brands for filter dropdown
  const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).sort();

  if (loading) {
    return (
      <ShopWrapper>
        <Container>
          <LoadingWrapper>
            <Loader size={48} className="animate-spin" color={colors.primary} />
            <Text size="lg">Loading products...</Text>
          </LoadingWrapper>
        </Container>
      </ShopWrapper>
    );
  }

  if (error) {
    return (
      <ShopWrapper>
        <Container>
          <EmptyState>
            <EmptyStateIcon>😞</EmptyStateIcon>
            <Text size="lg" color={colors.danger}>{error}</Text>
            <Button onClick={loadProducts} style={{ marginTop: '1rem' }}>
              Try Again
            </Button>
          </EmptyState>
        </Container>
      </ShopWrapper>
    );
  }

  return (
    <ShopWrapper>
      <Container>
        <PageTitle>Shop Tires & Rims</PageTitle>

        {/* Search Bar */}
        <SearchBar>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Search for tires, rims, brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        {/* Filters */}
        <FilterSection>
          <Flex justify="between" align="center" style={{ marginBottom: '1rem' }}>
            <Text size="lg" style={{ fontWeight: 600 }}>
              <Filter size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
              Filters
            </Text>
            <Button variant="secondary" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </Flex>
          
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Brand</FilterLabel>
              <Select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Availability</FilterLabel>
              <Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">All Products</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </Select>
            </FilterGroup>
          </FilterGrid>
        </FilterSection>

        {/* Results Header */}
        <ResultsHeader>
          <Text size="lg" style={{ fontWeight: 600 }}>
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Found
          </Text>
        </ResultsHeader>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>🔍</EmptyStateIcon>
            <Text size="lg">No products found matching your criteria.</Text>
            <Text color={colors.textLight}>
              Try adjusting your search or filter settings.
            </Text>
          </EmptyState>
        ) : (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onView={handleProductView}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ProductGrid>
        )}
      </Container>
    </ShopWrapper>
  );
};