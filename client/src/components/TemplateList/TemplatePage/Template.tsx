import { TemplateProps } from '../TemplateProps';
import * as styles from '../Common.styles';
import { COLORS } from '@/styles/colors';
import styled from '@emotion/styled';
import { getDayOfWeek } from '@/utils/func/getDayOfWeek';
import { getAccessToken } from '@/utils/lib/tokenHandler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postReservationCancel } from '@/apis/ReserveData';
import { useEffect, useState } from 'react';
import DecisionModal from '@/components/Modal/Decision';
import { MyTemplate } from '@/@types/MyTemplate';
import AuthApi from '@/apis/auth';
import { ReserveError } from '@/utils/types/ReserveError';
import { formatNextOccurrence } from '@/utils/func/templateTimeConverter';
import { WeekdayShort } from 'Template';
import ConfirmModal from '@/components/Modal/Confrim';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { css } from '@emotion/react';
import { flex } from '@/styles/tokens';
import Modal from '@/components/Modal';
import { injectAnimation } from '@/styles/animations';

const Template = ({
  title,
  day,
  beginTime,
  endTime,
  place,
  friends,
  type,
  reserveId,
  semina,
}: TemplateProps) => {
  const [templateArr, setTemplateArr] = useState<MyTemplate[]>([]);

  useEffect(() => {
    const storedCompanionMember = localStorage.getItem('templateArr');
    if (storedCompanionMember) {
      setTemplateArr(JSON.parse(storedCompanionMember));
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] =
    useState<boolean>(false);
  const [isTemplateModal, setIsTemplateModal] = useState<boolean>(false);
  const [isBottomModal, setIsBottomModal] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<ReserveError>({
    isError: false,
    errorMessage: '',
  });
  const AccessToken = getAccessToken();
  const queryClient = useQueryClient();

  const CancelReserve = useMutation(
    () => postReservationCancel(reserveId, AccessToken),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reserveCancel']);
      },
    },
  );

  const handleOnClickRemoveBtn = () => {
    setIsModalOpen(!isModalOpen);
  };
  const handleRemove = () => {
    CancelReserve.mutate();
    setIsModalOpen(false);
  };
  const handleTemplateRemove = () => {
    setIsTemplateModal(!isTemplateModal);
  };

  const handleOpenRemoveModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (templateArr === undefined || setTemplateArr === undefined) return;
    const curArr = templateArr.filter((e) => e.title !== title);
    localStorage.setItem('templateArr', JSON.stringify(curArr));
    location.reload();
  };

  const typeNumber = ['학습', '회의', '수업', '기타'];

  // 템플릿으로 예약하기
  const handleOnClickReserve = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ReserveArr: MyTemplate[] = templateArr.filter(
      (e) => e.title == title,
    );

    const authApi = new AuthApi();
    const korDay = [
      '일요일',
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
    ];
    const engDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const { beginTime, endTime } = formatNextOccurrence(
      engDay[korDay.indexOf(ReserveArr[0].day)] as WeekdayShort,
      ReserveArr[0].startTime,
      ReserveArr[0].finishTime,
    );

    if (ReserveArr[0]?.people[0]?.id !== undefined) {
      console.log(
        'comp',
        ReserveArr[0].people.map((res) => res.id!),
      );
      authApi
        .reservation(
          String(ReserveArr[0].semina[0]),
          typeNumber.indexOf(ReserveArr[0].type),
          beginTime,
          endTime,
          ReserveArr[0].people.map((res) => res.info.alternativeId),
        )
        .then((res) => {
          if (res.success) {
            setIsSuccess(true);
            setIsTemplateModalOpen(true);
          } else {
            setIsTemplateModalOpen(true);

            setIsError({ isError: true, errorMessage: res.message });
          }
        });
    }
  };

  const getTemplateDayOfWeek = (number: string): string => {
    switch (number) {
      case '1':
        return '월요일';
      case '2':
        return '화요일';
      case '3':
        return '수요일';
      case '4':
        return '목요일';
      case '5':
        return '금요일';
      case '6':
        return '토요일';
      default:
        throw new Error('Invalid day number.');
    }
  };

  const handleTemplateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBottomModal(true);
  };

  const handleRemoveTemplate = () => {
    if (type === 'RESERVE') {
      handleOnClickRemoveBtn();
    } else {
      handleTemplateRemove();
    }
  };

  const handleRouteEdit = () => {};

  return (
    <>
      <styles.Container css={injectAnimation('fadeInTopDown', '0.5s', 'ease')}>
        <InfoBox>
          <styles.TitleBox>
            <div
              onClick={(e) => {
                if (type === 'TEMPLATE') {
                  handleTemplateClick(e);
                }
              }}
            >
              {title}
            </div>
            <RemoveBox>
              {type === 'TEMPLATE' && (
                <FontAwesomeIcon
                  icon={faGear}
                  css={css`
                    font-size: 1.6rem;
                    cursor: pointer;
                  `}
                />
              )}
              <FontAwesomeIcon
                icon={faXmark}
                onClick={handleRemoveTemplate}
                css={css`
                  cursor: pointer;
                `}
              />
            </RemoveBox>
          </styles.TitleBox>
          <div
            onClick={(e) => {
              if (type === 'TEMPLATE') {
                handleTemplateClick(e);
              }
            }}
          >
            <styles.DateBox>
              {type === 'RESERVE'
                ? getDayOfWeek(beginTime) +
                  beginTime.slice(10, 13) +
                  '시 -' +
                  endTime.slice(10, 13) +
                  '시'
                : day + ' ' + beginTime + ' ~ ' + endTime}
            </styles.DateBox>
            <styles.PlaceBox>{place}</styles.PlaceBox>
            <styles.PeopleBox>
              {type === 'RESERVE'
                ? friends.map((el, idx) => {
                    return (
                      <styles.PersonInfo key={idx}>
                        {el.name} / {el.memberNo}
                      </styles.PersonInfo>
                    );
                  })
                : friends.map((el, idx) => {
                    return (
                      <styles.PersonInfo key={idx}>
                        {el.info?.name} / {el.info?.sId}
                      </styles.PersonInfo>
                    );
                  })}
            </styles.PeopleBox>
          </div>
        </InfoBox>
        <SideLine />
      </styles.Container>
      {isTemplateModal ? (
        <DecisionModal
          title={title}
          message="템플릿을 정말 삭제할까요?"
          onCancle={() => setIsTemplateModal(false)}
          onClick={(e) => {
            handleOpenRemoveModal(e);
          }}
        />
      ) : (
        ''
      )}
    </>
  );
};

const RemoveBox = styled.div`
  margin-left: auto;
  ${flex('row', 'end', 'center', 1)}
  font-size: 2rem;
  gap: 0.6rem;
`;

const InfoBox = styled.div`
  width: 100%;
  background-color: ${COLORS.grey7};
  padding: 1.8rem 1.8rem 1.8rem 2.2rem;
  border-radius: 10px 0 0 10px;
`;

const SideLine = styled.div`
  background-color: ${COLORS.primary};
  border-radius: 0 10px 10px 0;
  width: 5px;
`;

const ImgBox = styled.div`
  display: flex;
  align-items: center;
`;

export default Template;
