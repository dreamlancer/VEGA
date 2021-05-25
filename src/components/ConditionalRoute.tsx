import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

export interface ConditionalRouteProps extends RouteProps {
  redirectTo: string;
  condition: boolean;
}

export const ConditionalRoute = ({
  redirectTo,
  condition,
  ...props
}: ConditionalRouteProps) => {
  if (!condition) {
    return <Redirect to={redirectTo} />;
  }
  return <Route {...props} />;
};
