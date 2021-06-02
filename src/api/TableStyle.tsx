import styled, { css } from 'styled-components';

interface TableStyleProps {
  pointer?: boolean;
}
export const TableStyle = styled.div<TableStyleProps>`
  ${({ pointer }) =>
    pointer &&
    css`
      .ant-table-row {
        cursor: pointer;
      }
    `}

  .ant-table-thead > tr > th {
    color: #fff;
    background: rgba(8, 81, 161, 0.9);
    font-weight: bold;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #e1e1e1;
  }
  .ant-table-tbody > tr.ant-table-row:nth-child(odd) {
    background-color: #E8F3FF;
  }
  .waiting {
    td:last-child {
      color: red;
    }
  }
`;
