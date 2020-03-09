/** @jsx jsx */
import { FC, Fragment } from 'react';
import styled from '@emotion/styled';
import { jsx, css } from '@emotion/core';
import { Abcd } from '../Types';

const Td = styled.div`
  border: 1px solid black;
`;

export const AbcdsTable: FC<{
  abcds: Abcd[];
  onRemove: (abcd: Abcd) => void;
}> = ({ abcds, onRemove }) => {
  return abcds.length > 0 ? (
    <div
      css={css`
        display: grid;
        grid-template-columns: repeat(5, 1fr);
      `}
    >
      <Td>Activating</Td>
      <Td>Belief</Td>
      <Td>Consequences</Td>
      <Td>Dispute</Td>
      <div></div>
      {abcds.map((abcd: Abcd, index: number) => (
        <Fragment key={index}>
          <Td>{abcd.activating}</Td>
          <Td>{abcd.belief}</Td>
          <Td>{abcd.consequences}</Td>
          <Td>{abcd.dispute}</Td>
          <div>
            <button
              type="button"
              onClick={() => {
                onRemove(abcd);
              }}
            >
              Delete
            </button>
          </div>
        </Fragment>
      ))}
    </div>
  ) : null;
};
