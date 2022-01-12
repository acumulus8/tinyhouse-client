import React from "react";
import { Card, Layout, Typography } from "antd";
import googleLogo from "./assets/google_logo.png";

const { Content } = Layout;
const { Text, Title } = Typography;

export const LogIn = () => {
  return (
    <Content className="log-in">
      <Card className="log-in-card">
        <div className="ton-in-card__intro">
          <Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              👋
            </span>
          </Title>
          <Title level={3} className="log-in-card__intro-title">
            Log in to TinyHouse!
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
        </div>
        <button className="log-in-card__google-button">
          <img src={googleLogo} alt="Google logo" className="log-in-card__google-button-logo" />
          <span className="log-in-card__google-button-text">Sign in with Google</span>
        </button>
        <Text type="secondary">Note: By signing in, you'll be redirected to the Google consent form to sign in with your google account.</Text>
      </Card>
    </Content>
  )
}