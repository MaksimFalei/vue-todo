<template>
  <div id="app">
    <header>
      <nav class="navbar navbar-dark bg-dark">
        <h1 class="navbar-brand">ToDo List</h1>
        <SearchInput v-model="searchText" />
        <b-button variant="outline-light" :pressed.sync="pagination">
          {{ togglerText }}
        </b-button>
      </nav>
      <nav class="navbar navbar-dark bg-dark d-flex justify-content-center">
        <Filters v-model="status" :filters="filters" />
      </nav>
    </header>
    <main class="d-flex row w-100 mx-auto justify-content-center">
      <div v-if="loading" class="text-center spinner">
        <b-spinner variant="primary" label="Text Centered"></b-spinner>
      </div>
      <AlertPopUp
        :message="message"
        :isDismissed="isAlertDismissed"
        @alertDissmised="onAlertDismissed"
      />
      <NewItem @addItem="onModalOk" />
      <Pagination
      :totalRows="totalRows"
      v-model="currentPage"
      v-if="pagination"
      >
         <b-card-group deck id="items-list">
        <CardItem
          v-for="item in paginatedList"
          :key="item.id"
          :item="item"
          @delete="onDeleteItem(item)"
          @changeStatus="onChangeCompleted(item)"
        />
      </b-card-group>
      </Pagination>

      <b-card-group v-if="!pagination" deck id="items-list">
        <CardItem
          v-for="item in infiniteList"
          :key="item.id"
          :item="item"
          @delete="onDeleteItem"
          @changeStatus="onChangeCompleted"
        />
      </b-card-group>
      <b-button v-show="isInfiniteLoading" ref="paragraph" variant="primary" disabled>
        <b-spinner small type="grow"></b-spinner>
        Loading...
      </b-button>
    </main>
  </div>
</template>

<script>
import { MESSAGES, FILTER_OPTIONS, PER_PAGE } from "./constants/constants";
import apiCalls from "./API/apiCalls";
import SearchInput from "./components/SearchInput";
import CardItem from "./components/CardItem";
import AlertPopUp from "./components/AlertPopUp";
import NewItem from "./components/NewItem";
import Filters from "./components/Filters";
import Pagination from "./components/Pagination";

export default {
  name: "App",
  components: {
    SearchInput,
    CardItem,
    AlertPopUp,
    NewItem,
    Filters,
    Pagination,
  },
  data: () => ({
    status: "all",
    filterOptions: FILTER_OPTIONS,
    list: [],
    currentPage: 1,
    observeStage: 1,
    searchText: "",
    isAlertDismissed: true,
    message: {},
    loading: true,
    pagination: true,
    observer: null,
  }),
  methods: {
    initObserver() {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              this.observeStage++;
            }, 1000);
          }
        });
      });
      console.log('this.$refs.paragraph: ', this.$refs.paragraph);
      this.observer.observe(this.$refs.paragraph);
    },
    onModalOk(item) {
      this.loading = true;
      apiCalls
        .postItem(item)
        .then((res) => {
          if (res) {
            this.list = [res,...this.list];
            this.showAlert(MESSAGES.SUCCESS_ADD);
          }
        })
        .catch(() => this.showAlert(MESSAGES.FAILED_ADD));
    },
    showAlert(message) {
      this.loading = false;
      this.message = message;
      this.isAlertDismissed = false;
    },

    onAlertDismissed() {
      this.isAlertDismissed = true;
    },
    matchSearch(text) {
      const regexp = new RegExp(`${this.searchText}`, "gi");
      return regexp.test(text);
    },
    onDeleteItem(item) {
      this.loading = true;
      apiCalls
        .deleteItem(item.id)
        .then((res) => {
          if (res) {
            this.list = this.list.reduce((acc, itemList) => {
              if (itemList.id !== item.id) {
                acc.push(itemList);
              }
              return acc;
            }, []);
            this.showAlert(MESSAGES.SUCCESS_DELETE);
          }
        })
        .catch(() => this.showAlert(MESSAGES.FAILED_DELETE));
    },

    onChangeCompleted(item) {
      this.loading = true;
      item.completed = !item.completed;
      apiCalls
        .putItem(item)
        .then((res) => {
          if (res) {
            this.list = this.list.map((listItem) => {
              if (listItem.id === res.id) {
                listItem = res;
              }
              return listItem;
            });
            this.showAlert(MESSAGES.SUCCESS_COMPLETE);
          }
        })
        .catch(() => this.showAlert(MESSAGES.FAILED_COMPLETE));
    },
  },
  computed: {
    togglerText() {
      return this.pagination ? "Infinite" : "Pagination";
    },
    isInfiniteLoading() {
      return !this.pagination && this.infiniteList.length !== this.filteredList.length;
    },
    infiniteList() {
      const itemCount = this.observeStage * PER_PAGE;
      return this.filteredList.filter((item, i) => {
        if (i < itemCount) {
          return item;
        }
      });
    },
    filters() {
      return Object.values(this.filterOptions);
    },
    filteredList() {
      let filteredList = [];
      switch (this.status) {
        case FILTER_OPTIONS.COMPLETED:
          filteredList = this.list.filter((item) => {
            if (
              this.searchText &&
              this.matchSearch(item.title) &&
              item.completed
            ) {
              return item;
            } else if (!this.searchText && item.completed) {
              return item;
            }
          });
          break;
        case FILTER_OPTIONS.NOT_COMPLETED:
          filteredList = this.list.filter((item) => {
            if (
              this.searchText &&
              this.matchSearch(item.title) &&
              !item.compared
            ) {
              return item;
            } else if (!this.searchText && !item.completed) {
              return item;
            }
          });
          break;
        case FILTER_OPTIONS.ALL:
          filteredList = this.list.filter((item) => {
            if (this.searchText && this.matchSearch(item.title)) {
              return item;
            } else if (!this.searchText) {
              return item;
            }
          });
          break;
      }
      return filteredList;
    },
    totalRows() {
      return this.filteredList.length || 1;
    },
    paginatedList() {
      let paginatedList = [];

      if (this.currentPage) {
        const itemCount = (this.currentPage - 1) * 12;
        paginatedList = this.filteredList.filter((item, i) => {
          if (i + 1 > itemCount && i + 1 <= itemCount + 12) {
            return item;
          }
        });
      }

      return paginatedList;
    },
  },
  mounted() {
    apiCalls.getItems().then((data) => {
      this.loading = false;
      this.list = data;
    });
  },
  watch: {
    status() {
      this.currentPage = 1;
      this.observeStage = 1;
    },
    pagination(value) {
      if (!value) {
        this.initObserver();
      }
    }
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

#add-item-button {
  margin: 30px auto;
  width: 80%;
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

.spinner {
  position: absolute;
  margin: auto;
  height: 100%;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.spinner .spinner-border {
  width: 5rem;
  height: 5rem;
}
</style>
