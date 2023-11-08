import { COLORS } from '@/styles/colors';
import { flex } from '@/styles/tokens';
import styled from '@emotion/styled';
import { HTMLMotionProps, motion } from 'framer-motion';
import AddMateBox from './AddMateBox';
import { useMate } from '@/hooks';

export type KitType = 'selectable' | 'removable';

interface Props extends HTMLMotionProps<'ul'> {
  kitType: KitType;
  selectedList?: string[];
  handleSelect?: (idx: number) => void;
}

/**
 * 메이트 관련 기능을 편리하게 사용할 수 있는 키트
 *
 * useMate와 함께 이용하세요
 *
 * @param kitType 선택형 UI (selectable) / 삭제형 UI (removable)
 * @param selectedList 선택한 메이트의 학생 ID가 담길 배열
 * @param handleSelect 인덱스 값에 따라 메이트를 추가하는 함수
 */
const MateManageKit = ({
  kitType,
  selectedList,
  handleSelect,
  ...props
}: Props) => {
  const { isErr, saveMateList } = useMate();
  return (
    <Container layout {...props}>
      <AddMateBox isErr={isErr} saveMateList={saveMateList} />
    </Container>
  );
};

const Container = styled(motion.ul)`
  width: 100%;
  ${flex('column', 'start', 'center', 0)};
  background-color: ${COLORS.grey55};
  padding: 0px;
  margin: 0px;
  list-style-type: none;
`;

export default MateManageKit;
