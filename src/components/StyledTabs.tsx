import styled from 'styled-components';

export const StyledTabs = styled.div`
  .ant-tabs-card > .ant-tabs-content {
    margin-top: -16px;
  }
  [data-theme='compact'] .card-container > .ant-tabs-card > .ant-tabs-content {
    margin-top: -8px;
  }

  [data-theme='compact']
    > .ant-tabs-card
    > .ant-tabs-content
    > .ant-tabs-tabpane,
  .ant-tabs-card > .ant-tabs-content > .ant-tabs-tabpane {
    background: #fff;
    padding: 16px;
  }

  [data-theme='compact'] .card-container > .ant-tabs-card > .ant-tabs-bar,
  .ant-tabs-card > .ant-tabs-bar {
    border-color: #fff;
  }

  [data-theme='compact']
    .card-container
    > .ant-tabs-card
    > .ant-tabs-bar
    .ant-tabs-tab,
  .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab {
    border-color: transparent;
    background: transparent;
  }

  [data-theme='compact']
    .card-container
    > .ant-tabs-card
    > .ant-tabs-bar
    .ant-tabs-tab-active,
  .ant-tabs-card > .ant-tabs-bar .ant-tabs-tab-active {
    border-color: #fff;
    background: #fff;
  }
`;
