/** @jsx jsx */
import { FC } from 'react';
import { jsx, css } from '@emotion/core';
import info from '../info';
import { Steps } from '../Types';
export const InfoSidebar: FC<{
  currentStep: Steps | null;
}> = ({ currentStep }) => {
  return currentStep ? (
    <div
      css={css`
        margin: 10px;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
      `}
    >
      <h1>{info[currentStep].title}</h1>
      <p>{info[currentStep].description}</p>
      <p>{info[currentStep].example}</p>
    </div>
  ) : null;
};
