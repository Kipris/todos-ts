import { gql } from "@apollo/client";
const getAllTodosGraphql = gql`
  query {
    getAllTodos {
      id
      title
      completed
    }
  }
`;

const addTodoGraphql = gql`
  mutation addTodo($title: TodoInput) {
    addTodo(todo: $title) {
      id
      title
      completed
    }
  }
`;

const removeTodoGraphql = gql`
  mutation removeTodo($id: ID!) {
    removeTodo(id: $id) {
      id
      title
      completed
    }
  }
`;

const updateTodoGraphql = gql`
  mutation updateTodo($id: ID!) {
    updateTodo(id: $id) {
      id
      title
      completed
    }
  }
`;

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getAllTodosGraphql,
  addTodoGraphql,
  removeTodoGraphql,
  updateTodoGraphql,
};
