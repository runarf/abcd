/** @jsx jsx */
import { FC } from 'react';
import { Formik, Form, useField } from 'formik';
import { jsx, css } from '@emotion/core';
import uuidv4 from 'uuid/v4';
import { Steps, Abcd } from '../Types';
import { User } from 'firebase';

const MyTextInput: FC<{
  label: string;
  name: Steps;
  onClick: () => void;
  [otherProps: string]: any;
}> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: center;
      `}
    >
      <label htmlFor={props.id || props.name}>{label}</label>
      <textarea
        css={css`
          height: 100px;
        `}
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? <div>{meta.error}</div> : null}
    </div>
  );
};

export const AbcdForm: FC<{
  onSubmit: (values: Abcd) => void;
  onClickTextInput: (step: Steps) => void;
  currentUser: User | null;
}> = ({ onSubmit, onClickTextInput, currentUser }) => {
  return (
    <Formik
      initialValues={{
        id: uuidv4(),
        activating: '',
        belief: '',
        consequences: '',
        dispute: ''
      }}
      onSubmit={values => {
        onSubmit(values);
      }}
    >
      {() => (
        <Form>
          <div
            css={css`
              display: flex;
              justify-content: space-around;
            `}
          >
            <MyTextInput
              placeholder="What happened?"
              onClick={() => {
                onClickTextInput(Steps.Activating);
              }}
              label="Activating"
              name={Steps.Activating}
              type="text"
            />
            <MyTextInput
              placeholder="What did you think?"
              onClick={() => {
                onClickTextInput(Steps.Belief);
              }}
              label="Belief"
              name={Steps.Belief}
              type="text"
            />
            <MyTextInput
              placeholder="What is the consequence of those thoughts?"
              onClick={() => {
                onClickTextInput(Steps.Consequences);
              }}
              label="Consequences"
              name={Steps.Consequences}
              type="text"
            />
            <MyTextInput
              placeholder="What other reasons could there be?"
              onClick={() => {
                onClickTextInput(Steps.Dispute);
              }}
              label="Dispute"
              name={Steps.Dispute}
              type="text"
            />
          </div>

          <div
            css={css`
              margin-top: 50px;
              display: flex;
              justify-content: center;
            `}
          >
            {currentUser ? (
              <button type="submit">Submit</button>
            ) : (
              <div>Please sign in on the left to submit and save the data</div>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};
