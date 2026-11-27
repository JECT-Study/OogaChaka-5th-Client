export const MARKET_MESSAGES = {
  loading: {
    listAriaLabel: '상품 목록을 불러오는 중',
    item: '상품 정보를 불러오는 중이에요.',
  },
  toast: {
    createSuccess: '상품을 성공적으로 등록했어요!',
    updateSuccess: '상품을 성공적으로 수정했어요!',
    deleteSuccess: '상품을 성공적으로 삭제했어요!',
  },
  empty: {
    listErrorTitle: '상품을 불러오지 못했어요.',
    listEmptyTitle: '등록된 상품이 없어요.',
    listEmptyDescription: '자녀가 포인트로 교환할 첫 보상 상품을 등록해 보세요.',
    childListEmptyDescription: '보호자가 보상 상품을 등록하면 이곳에서 확인할 수 있어요.',
    listEmptyAction: '상품 등록하기',
    invalidItemTitle: '유효하지 않은 상품이에요.',
    invalidItemDescription: '상품 정보를 다시 선택한 뒤 확인해 주세요.',
    editNotFoundTitle: '수정할 상품을 찾을 수 없어요.',
    editNotFoundDescription: '마켓에서 상품을 다시 선택해 주세요.',
    notFoundTitle: '상품을 찾을 수 없어요.',
    detailErrorTitle: '상품을 불러오지 못했어요.',
    editErrorTitle: '상품 정보를 불러오지 못했어요.',
    backToMarketAction: '마켓으로 돌아가기',
    retryAction: '다시 시도',
  },
  detail: {
    emptyPurchaseMessage: '등록된 메시지가 없어요.',
  },
  validation: {
    imageRequired: '상품 사진을 등록해 주세요.',
  },
  limitModal: {
    title: '상품 등록 개수를 초과했어요',
    description:
      '상품은 최대 12개까지 등록할 수 있어요. 새로운\n상품을 등록하려면 기존 상품을 삭제해 주세요.',
    secondaryLabel: '목록 수정하기',
    primaryLabel: '등록 그만두기',
  },
  deleteSheet: {
    title: '상품을 삭제할까요?',
    description: '삭제한 상품은 다시 되돌릴 수 없어요. 이 상품을 정말 삭제할까요?',
    cancelLabel: '취소',
    confirmLabel: '삭제하기',
    loadingLabel: '삭제 중...',
  },
  purchaseSheet: {
    cancelLabel: '취소',
    confirmLabel: '선택하기',
    loadingLabel: '처리 중...',
    description: (points: number) =>
      `전체 포인트에 ${points.toLocaleString()} 포인트가 차감될 거에요.\n이 상품으로 선택할까요?`,
  },
  purchaseCompleteDialog: {
    title: '상품 지급을 요청했어요.',
    description: '보호자에게 상품 지급을 요청했어요.\n확인이 완료되면 상품을 받을 수 있어요!',
    actionLabel: '마켓으로 돌아가기',
  },
} as const;
