<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-dark bg-dark">
        <h1 class="navbar-brand">ToDo List</h1>
        <div class="filter-text input-group input-group-sm">
          <div class="input-group-prepend">
            <span class="input-group-text">Search</span>
          </div>
          <input type="text" v-model="searchText" class="form-control" />
        </div>
      </nav>
      <nav class="navbar navbar-dark bg-dark d-flex justify-content-center">
        <div class="filter-completed-all btn-group btn-group-toggle">
          <label
            v-for="option in filterOptions"
            class="btn btn-light"
            :key="option"
            :class="{ active: status === option }"
          >
            <input type="radio" name="options" :value="option" v-model="status" />
            {{ option | capitalize }}
          </label>
        </div>
      </nav>
    </header>
    <main class="d-flex row w-100 mx-auto justify-content-center">
      <div v-if="loading" class="text-center spinner">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <b-button v-b-modal.new-item-modal block variant="outline-dark" id="add-item-button">Add new item</b-button>
      <b-alert
        class="success-message position-fixed"
        :show="dismissCountDown"
        dismissible
        :variant="message.success ? 'success' : 'danger'"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
      >
        <p>{{ message.text }}</p>
      </b-alert>
      <b-modal id="new-item-modal" title="New item" @cancel="onModalCancel" @close="onModalCancel" @ok="onModalOk">
        <b-form-textarea
          id="textarea"
          autofocus
          v-model="newItemText"
          placeholder="Enter something..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
      </b-modal>
      <div>
        <b-card-group deck id="items-list">
          <b-card
            v-for="item in paginatedList"
            :bg-variant="item.completed ? 'success' : 'dark'"
            text-variant="white"
            :title="`Task #${item.id}`"
            :key="item.id"
          >
            <b-card-text>
              {{ item.title }}
            </b-card-text>
            <div class="d-flex justify-content-between">
              <b-button @click="onDeleteItem(item)" variant="danger">Delete</b-button>
              <b-button @click="onChangeCompleted(item)" v-if="!item.completed" variant="primary">Complete</b-button>
              <b-button @click="onChangeCompleted(item)" v-if="item.completed" variant="warning">Uncopmplete</b-button>
            </div>
          </b-card>
        </b-card-group>
        <div class=" d-flex overflow-auto justify-content-center pagination-wrapper"></div>
      </div>
    </main>
    <footer class="d-flex row w-100 m-auto justify-content-center fixed-bottom">
      <b-pagination
        class="custom-pagination"
        v-model="currentPage"
        :total-rows="filteredList.length ? filteredList.length : 1"
      >
      </b-pagination>
    </footer>
  </div>
</template>

<script>
import _isEqual from 'lodash/isEqual';
import _capitalize from 'lodash/capitalize';
const BASE_URL = 'https://jsonplaceholder.typicode.com/todos';
const MESSAGES = {
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

export default {
  name: 'App',
  data: () => ({
    status: 'all',
    filterOptions: ['all', 'completed', 'not completed'],
    newItemText: '',
    list: [],
    dismissSecs: 3,
    dismissCountDown: 0,
    showDismissibleAlert: false,
    currentPage: 1,
    paginatedList: [],
    filteredList: [],
    searchText: '',
    message: {},
    loading: true,
  }),
  methods: {
    onModalCancel() {
      this.newItemText = '';
    },
    onModalOk() {
      const item = {
        userId: 1,
        title: this.newItemText,
        completed: false,
      };
      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'POST',
        body: JSON.stringify(item),
      };
      this.loading = true;

      fetch(BASE_URL, options)
        .then((res) => res.json())
        .then((res) => {
          if (res) {
            this.newItemText = '';
            this.list = [...this.list, res];
            this.showAlert('SUCCESS_ADD');
          }
        })
        .catch(() => this.showAlert('FAILED_ADD'));
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    showAlert(text) {
      this.loading = false;
      this.message = MESSAGES[text];
      this.dismissCountDown = this.dismissSecs;
    },
    filterList() {
      switch (this.status) {
        case 'completed':
          this.filteredList = this.list.filter((item) => {
            if (this.searchText && this.matchSearch(item.title) && item.completed) {
              return item;
            } else if (!this.searchText && item.completed) {
              return item;
            }
          });
          break;
        case 'not completed':
          this.filteredList = this.list.filter((item) => {
            if (this.searchText && this.matchSearch(item.title) && !item.compared) {
              return item;
            } else if (!this.searchText && !item.completed) {
              return item;
            }
          });
          break;
        case 'all':
          this.filteredList = this.list.filter((item) => {
            if (this.searchText && this.matchSearch(item.title)) {
              return item;
            } else if (!this.searchText) {
              return item;
            }
          });
          break;
      }
    },

    setPagenatedList() {
      if (this.currentPage) {
        const itemCount = (this.currentPage - 1) * 12;
        this.paginatedList = this.filteredList.filter((item, i) => {
          if (i + 1 > itemCount && i + 1 <= itemCount + 12) {
            return item;
          }
        });
      }
    },

    matchSearch(text) {
      const regexp = new RegExp(`${this.searchText}`, 'gi');
      return regexp.test(text);
    },

    onDeleteItem(item) {
      this.loading = true;
      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'DELETE',
      };
      fetch(`${BASE_URL}/${item.id}`, options)
        .then((res) => res.json())
        .then((res) => {
          if (res) {
            this.list = this.list.reduce((acc, itemList) => {
              if (itemList.id !== item.id) {
                acc.push(itemList);
              }
              return acc;
            }, []);
            this.showAlert('SUCCESS_DELETE');
          }
        })
        .catch(() => this.showAlert('FAILED_DELETE'));
    },

    onChangeCompleted(item) {
      this.loading = true;
      item.completed = !item.completed;
      const options = {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        method: 'PUT',
        body: JSON.stringify(item),
      };
      fetch(`${BASE_URL}/${item.id}`, options)
        .then((res) => res.json())
        .then((res) => {
          if (res) {
            this.list = this.list.map((listItem) => {
              if (listItem.id === res.id) {
                listItem = res;
              }
              return listItem;
            });
            this.showAlert('SUCCESS_COMPLETE');
          }
        })
        .catch(() => this.showAlert('FAILED_COMPLETE'));
    },
  },
  filters: {
    capitalize(val) {
      return val
        .split(' ')
        .map((s) => _capitalize(s))
        .join(' ');
    },
  },

  mounted() {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        this.loading = false;
        this.list = data;
      });
  },
  watch: {
    list: function(val, oldVal) {
      if (!_isEqual(val, oldVal)) {
        this.filterList();
      }
    },
    filteredList: function() {
      this.setPagenatedList();
    },
    status: function() {
      this.currentPage = 1;
      this.filterList();
    },
    currentPage: function() {
      this.setPagenatedList();
    },
    searchText: function() {
      this.filterList();
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.input-group.filter-text {
  margin: 0 auto;
  width: 50%;
}

#add-item-button {
  margin: 30px auto;
  width: 80%;
}

.success-message {
  right: 0;
  top: 20px;
}

main {
  padding: 0 5%;
}

#items-list {
  margin-top: 10px;
  margin-left: auto;
  display: grid;
  grid-template-columns: repeat(4, minmax(280px, 1fr));
  grid-gap: 0.5rem;
}

.pagination-wrapper {
  margin-top: 10px;
}

.pagination.custom-pagination .page-item .page-link {
  background-color: #343a40;
  color: white;
  border-color: white;
}

.pagination.custom-pagination .page-item.active .page-link,
.pagination.custom-pagination .page-item .page-link:hover {
  color: black;
  background-color: #dae0e5;
}

.spinner {
  position: absolute;
  margin: auto;
  height: 100vh;
  display: flex;
  align-items: center;
}
</style>
