import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit3, Trash2, Package, DollarSign, Tag, Loader } from 'lucide-react';
import { Product, CreateProductRequest } from '../types/Product';
import { ApiService } from '../services/api';
import {
  Container,
  PageTitle,
  Card,
  Button,
  Input,
  TextArea,
  Flex,
  Grid,
  Text,
  Badge,
  colors,
  SectionTitle
} from '../styles/GlobalStyles';

const DashboardWrapper = styled.div`
  padding: 2rem 0;
  min-height: 80vh;
`;

const QuickAddSection = styled(Card)`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryHover} 100%);
  color: ${colors.white};
  margin-bottom: 2rem;
`;

const QuickAddForm = styled.form`
  display: grid;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr auto;
    align-items: end;
  }
`;

const QuickInput = styled(Input)`
  background: ${colors.white};
  border: none;
  
  &::placeholder {
    color: ${colors.textLight};
  }
`;

const QuickTextArea = styled(TextArea)`
  background: ${colors.white};
  border: none;
  min-height: 80px;
  
  &::placeholder {
    color: ${colors.textLight};
  }
`;

const QuickAddButton = styled(Button)`
  background: ${colors.white};
  color: ${colors.primary};
  
  &:hover {
    background: ${colors.light};
    transform: translateY(-2px);
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ProductItem = styled(Card)`
  padding: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProductActions = styled(Flex)`
  gap: 0.5rem;
`;

const ActionButton = styled(Button)`
  padding: 0.5rem;
  min-width: auto;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${colors.textLight};
`;

const SuccessMessage = styled.div`
  background: #dcfce7;
  color: #166534;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #bbf7d0;
  margin-bottom: 1rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #fecaca;
  margin-bottom: 1rem;
  text-align: center;
`;

const StatsCard = styled(Card)`
  text-align: center;
  background: ${colors.light};
  border: 2px solid ${colors.border};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.primary};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${colors.textLight};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Quick add form state - simplified for your uncle
  const [quickName, setQuickName] = useState('');
  const [quickDescription, setQuickDescription] = useState('');
  const [quickPrice, setQuickPrice] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllProducts();
      setProducts(data);
    } catch (error) {
      showMessage('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickName || !quickDescription || !quickPrice) {
      showMessage('error', 'Please fill in all fields');
      return;
    }

    const price = parseFloat(quickPrice);
    if (isNaN(price) || price <= 0) {
      showMessage('error', 'Please enter a valid price');
      return;
    }

    setAdding(true);

    try {
      const newProduct: CreateProductRequest = {
        name: quickName.trim(),
        brand: 'JB\'s Auto', // Default brand
        price: price,
        size: 'Standard', // Default size
        description: quickDescription.trim(),
        imageUrl: 'https://via.placeholder.com/300x200?text=Product+Image', // Placeholder image
        inStock: true // Default to in stock
      };

      await ApiService.createProduct(newProduct);
      
      // Clear form
      setQuickName('');
      setQuickDescription('');
      setQuickPrice('');
      
      // Reload products
      await loadProducts();
      
      showMessage('success', 'Product added successfully!');
    } catch (error) {
      showMessage('error', 'Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      await ApiService.deleteProduct(productId);
      await loadProducts();
      showMessage('success', 'Product deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete product');
    }
  };

  const inStockCount = products.filter(p => p.inStock).length;
  const outOfStockCount = products.filter(p => !p.inStock).length;

  return (
    <DashboardWrapper>
      <Container>
        <PageTitle>Admin Dashboard</PageTitle>
        
        {/* Stats Overview */}
        <Grid cols={3} gap="1rem" style={{ marginBottom: '2rem' }}>
          <StatsCard>
            <StatNumber>{products.length}</StatNumber>
            <StatLabel>Total Products</StatLabel>
          </StatsCard>
          <StatsCard>
            <StatNumber>{inStockCount}</StatNumber>
            <StatLabel>In Stock</StatLabel>
          </StatsCard>
          <StatsCard>
            <StatNumber>{outOfStockCount}</StatNumber>
            <StatLabel>Out of Stock</StatLabel>
          </StatsCard>
        </Grid>

        {/* Messages */}
        {message && (
          message.type === 'success' ? (
            <SuccessMessage>{message.text}</SuccessMessage>
          ) : (
            <ErrorMessage>{message.text}</ErrorMessage>
          )
        )}

        {/* Quick Add Section */}
        <QuickAddSection>
          <Flex align="center" gap="1rem" style={{ marginBottom: '1.5rem' }}>
            <Plus size={24} />
            <SectionTitle style={{ margin: 0, color: colors.white }}>
              Quick Add Product
            </SectionTitle>
          </Flex>
          
          <Text style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
            Just enter the product name, description, and price - we'll handle the rest!
          </Text>

          <QuickAddForm onSubmit={handleQuickAdd}>
            <div>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Product Name *
              </label>
              <QuickInput
                type="text"
                placeholder="e.g., Michelin All-Season Tires"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Price ($) *
              </label>
              <QuickInput
                type="number"
                step="0.01"
                min="0"
                placeholder="299.99"
                value={quickPrice}
                onChange={(e) => setQuickPrice(e.target.value)}
                required
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'block' }}>
                Description *
              </label>
              <QuickTextArea
                placeholder="Describe the product features, benefits, compatibility..."
                value={quickDescription}
                onChange={(e) => setQuickDescription(e.target.value)}
                required
              />
            </div>

            <QuickAddButton
              type="submit"
              disabled={adding}
              style={{ gridColumn: '1 / -1', justifySelf: 'start' }}
            >
              {adding ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Product
                </>
              )}
            </QuickAddButton>
          </QuickAddForm>
        </QuickAddSection>

        {/* Products List */}
        <Card>
          <SectionTitle>
            <Package size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            All Products ({products.length})
          </SectionTitle>

          {loading ? (
            <LoadingMessage>
              <Loader size={24} className="animate-spin" style={{ margin: '0 auto 1rem' }} />
              Loading products...
            </LoadingMessage>
          ) : products.length === 0 ? (
            <LoadingMessage>
              No products yet. Add your first product above!
            </LoadingMessage>
          ) : (
            <ProductList>
              {products.map((product) => (
                <ProductItem key={product._id}>
                  <Flex justify="between" align="start" gap="1rem">
                    <div style={{ flex: 1 }}>
                      <Flex align="center" gap="1rem" style={{ marginBottom: '0.5rem' }}>
                        <Text style={{ fontWeight: 600, fontSize: '1.125rem' }}>
                          {product.name}
                        </Text>
                        <Badge variant={product.inStock ? 'success' : 'danger'}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      </Flex>
                      
                      <Text size="sm" color={colors.textLight} style={{ marginBottom: '0.5rem' }}>
                        {product.brand} • {product.size}
                      </Text>
                      
                      <Text style={{ marginBottom: '0.75rem' }}>
                        {product.description}
                      </Text>
                      
                      <Flex align="center" gap="0.5rem">
                        <DollarSign size={16} color={colors.primary} />
                        <Text style={{ fontWeight: 600, fontSize: '1.25rem', color: colors.primary }}>
                          ${product.price.toFixed(2)}
                        </Text>
                      </Flex>
                    </div>

                    <ProductActions>
                      <ActionButton
                        variant="secondary"
                        size="sm"
                        title="Edit Product"
                        onClick={() => alert('Edit functionality coming soon!')}
                      >
                        <Edit3 size={16} />
                      </ActionButton>
                      <ActionButton
                        variant="danger"
                        size="sm"
                        title="Delete Product"
                        onClick={() => handleDelete(product._id, product.name)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </ProductActions>
                  </Flex>
                </ProductItem>
              ))}
            </ProductList>
          )}
        </Card>
      </Container>
    </DashboardWrapper>
  );
};