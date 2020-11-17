import { BASE_URL } from '../constants/constants';

const apiCalls = {
  getItems() {
    return fetch(BASE_URL)
    .then((res) => res.json())
  },
  postItem(text) {
    const item = {
      userId: 1,
      title: text,
      completed: false,
    };
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'POST',
      body: JSON.stringify(item),
    };

    return fetch(BASE_URL, options)
      .then((res) => res.json())
  },
  deleteItem(id) {
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'DELETE',
    };

    return fetch(`${BASE_URL}/${id}`, options)
      .then((res) => res.json())
  },
  putItem(item) {
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      method: 'PUT',
      body: JSON.stringify(item),
    };
    return fetch(`${BASE_URL}/${item.id}`, options)
      .then((res) => res.json())
  },
};

export default apiCalls;
