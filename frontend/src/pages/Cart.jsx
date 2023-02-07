import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import StripeCheckout from 'react-stripe-checkout';
import { Add, Remove } from '@material-ui/icons';
import styled from 'styled-components';
import { userRequest } from '../services/requestMethods';
import { mobile } from '../styles/responsive-config';

const KEY = import.meta.env.REACT_APP_STRIPE || 'pk_test_51MOxkgChXuFsQ8L21lCfhLbZeIbh979YNjPw2t3XDfbYfihHldmdajGKXMywkeHBe37rDj1NHOIz5Dz7oRqyZPvc005CD0dugl';

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: '10px' })}
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === 'filled' && 'none'};
  background-color: ${(props) =>
    props.type === 'filled' ? 'black' : 'transparent'};
  color: ${(props) => props.type === 'filled' && 'white'};
`;

const TopTexts = styled.div`
  ${mobile({ display: 'none' })}
`;
const TopText = styled.span`
  text-decoration: underline;
  cursor: pointer;
  margin: 0px 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: 'column' })}
`;

const Info = styled.div`
  flex: 3;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: 'column' })}
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  `;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
  ${mobile({ margin: '5px 15px' })}
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
  ${mobile({ marginBottom: '20px' })}
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 100%;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === 'total' && '500'};
  font-size: ${(props) => props.type === 'total' && '24px'};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.5s ease;
  &:hover{
      background-color: #fff;
      color: black;
  }
`;

const Cart = () => {

  const cart = useSelector(state => state.cart);

  const [stripeToken, setStripeToken] = useState(null);

  const navigate = useNavigate();

  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {

    const makeRequest = async () => {

      try {

        const res = await userRequest.post('/checkout/payment', {
          tokenId: stripeToken.id,
          amount: cart.total,
        });

        navigate('/success', {
          state: {
            stripeData: res.data,
            products: cart,
          }
        });

      } catch (error) {
        console.log(error);
      }

    };

    stripeToken && makeRequest();

  }, [stripeToken, cart.total, history]);

  console.log(stripeToken);

  return (
    <Container>
      <Wrapper>

        <Title>YOUR BAG</Title>

        <Bottom>

          <Info>
            {
              cart.products.map((event) => (
                <Product key={event._id}>

                  <ProductDetail>

                    <Image src={event.img} />

                    <Details>

                      <ProductName>
                        <div>
                          <b>Product:</b> {event.title}
                        </div>
                        <div>
                          <b>ID:</b> {event._id}
                        </div>
                      </ProductName>

                    </Details>

                  </ProductDetail>

                  <PriceDetail>

                    <ProductAmountContainer>
                      <Add />
                      <ProductAmount>{event.quantity}</ProductAmount>
                      <Remove />
                    </ProductAmountContainer>

                    <ProductPrice>
                      $ {event.price * event.quantity}
                    </ProductPrice>

                  </PriceDetail>

                </Product>
              ))
            }
            <Hr />
          </Info>

          <Summary>

            <SummaryTitle>ORDER SUMMARY</SummaryTitle>

            <SummaryItem type='total'>

              <SummaryItemText>Total</SummaryItemText>

              <SummaryItemPrice>$ {cart.total}</SummaryItemPrice>

            </SummaryItem>

            <StripeCheckout
              name='Jeandv'
              image='https://avatars.githubusercontent.com/u/90219458?v=4'
              billingAddress
              shippingAddress
              description={`Your total is $${cart.total}`}
              amount={cart.total}
              token={onToken}
              stripeKey={KEY}
            >
              <Button>CHECKOUT NOW</Button>
            </StripeCheckout>

          </Summary>

        </Bottom>
      </Wrapper>
    </Container>
  );
};

export default Cart;