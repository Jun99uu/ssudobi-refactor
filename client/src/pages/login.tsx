import { RoundButton } from '@/components/Buttons';
import { TextInput } from '@/components/Field';
import { useHeader, useVh } from '@/hooks';
import useAuth from '@/hooks/useAuth';
import { COLORS } from '@/styles/colors';
import { flex } from '@/styles/tokens';
import { TYPO } from '@/styles/typo';
import styled from '@emotion/styled';
import { useLayoutEffect } from 'react';

/**
 * 로그인 페이지
 */
const Login = () => {
  const { setHeader } = useHeader();
  const { fullPageStyle } = useVh();
  const { handleLogin } = useAuth();

  useLayoutEffect(() => {
    setHeader('로그인');
  }, []);

  return (
    <Container css={fullPageStyle}>
      <InputWrapper>
        <InputBox>
          <Caption>학번</Caption>
          <TextInput placeholder="ex. 20230000" value={''} />
        </InputBox>
        <InputBox>
          <Caption>비밀번호</Caption>
          <TextInput placeholder="도서관 비밀번호를 입력하세요." value={''} />
        </InputBox>
      </InputWrapper>
      <ButtonWrapper>
        <RoundButton title="로그인" theme="primary" onClick={handleLogin} />
        <Link>비밀번호를 재설정하고 싶어요.</Link>
      </ButtonWrapper>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 12rem 4.5rem;
  ${flex('column', 'between', 'center', 5)};
`;

const InputWrapper = styled.div`
  width: 100%;
  ${flex('column', 'start', 'start', 5)};
`;

const InputBox = styled.div`
  width: 100%;
  ${flex('column', 'start', 'start', 1)};
`;

const Caption = styled.span`
  ${TYPO.title3.Reg};
  color: ${COLORS.grey0};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  ${flex('column', 'start', 'center', 3)};
`;

const Link = styled.span`
  ${TYPO.text2.Reg};
  color: ${COLORS.grey3};
  cursor: pointer;
  text-decoration: underline;
`;

export default Login;
