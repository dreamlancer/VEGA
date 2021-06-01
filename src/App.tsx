import React, {useState} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { RootState } from 'store';
import { useSelector } from 'react-redux';
import { ConditionalRoute } from 'components/ConditionalRoute';
import { routes } from 'constants/routes';
import { LoginScreen } from 'screens/Login';
import { Dashboard } from 'screens/Dashboard';
import { Agenda } from 'screens/Agenda';
import { NewDoc } from 'screens/NewDoc';
import { Config } from 'screens/Config';
import { ErrorComponent } from 'components/ErrorComponent';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export const App = () => {
  const { rut, error } = useSelector(({ app }: RootState) => app);

  if (error) {
    return <ErrorComponent name={error?.name} message={error?.message} />;
  }

  const condition = !!rut;
  return (
    <BrowserRouter basename="/app">
      <Switch>
        <Route path={routes.login} exact>
          <LoginScreen />
        </Route>
        <ConditionalRoute
          path={routes.home}
          condition={condition}
          exact
          redirectTo={routes.login}
        >
          <Dashboard />
        </ConditionalRoute>
        <ConditionalRoute
          path={routes.new}
          condition={condition}
          exact
          redirectTo={routes.login}
        >
          <NewDoc />
        </ConditionalRoute>
        <ConditionalRoute
          path={routes.agenda}
          condition={condition}
          exact
          redirectTo={routes.login}
        >
          <Agenda />
        </ConditionalRoute>
        <ConditionalRoute
          path={routes.config}
          condition={condition}
          exact
          redirectTo={routes.login}
        >
          <Config />
        </ConditionalRoute>
      </Switch>
    </BrowserRouter>
  );
};
