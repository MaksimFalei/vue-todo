export const MESSAGES = {
  SUCCESS_DELETE: {
    text: 'Item was successfully deleted',
    success: true,
  },
  SUCCESS_ADD: {
    text: 'Item was successfully added',
    success: true,
  },
  SUCCESS_COMPLETE: {
    text: 'Item was successfully completed',
    success: true,
  },
  FAILED_COMPLETE: {
    text: 'Item wasn`t completed',
    success: false,
  },
  FAILED_DELETE: {
    text: 'Item wasn`t deleteded',
    sucess: false,
  },
  FAILED_ADD: {
    text: 'Item wasn`t added',
    success: false,
  },
};

export const FILTER_OPTIONS = {
  ALL: 'all',
  COMPLETED: 'completed',
  NOT_COMPLETED: 'not completed'
};

export const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';

export const PER_PAGE = 12;
