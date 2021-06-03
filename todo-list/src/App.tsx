import "./App.css";

import React, { FunctionComponent, useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import { useMutation, useQuery } from "@apollo/client";

import { Todo } from "./interfaces";
import graphqlRequests from "./graphqlRequests";

import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Error from "./components/Error/Error";

const {
  getAllTodosGraphql,
  addTodoGraphql,
  removeTodoGraphql,
  updateTodoGraphql,
} = graphqlRequests;
const App: FunctionComponent = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const [error, setError] = useState<null | string>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const { data: allTodos, loading: getAllTodosLoading } = useQuery(
    getAllTodosGraphql
  );

  const [addTodo, { loading: addTodoLoading }] = useMutation(addTodoGraphql);
  const [removeTodo, { loading: removeTodoLoading }] = useMutation(
    removeTodoGraphql
  );
  const [toggleTodo, { loading: toggleTodoLoading }] = useMutation(
    updateTodoGraphql
  );

  const handleSearch = (evt: React.FormEvent) => {
    evt.preventDefault();

    if (!searchInput) {
      setError("Type something");
      return;
    }
    setTodos((prevTodos) => {
      return (prevTodos as Todo[]).map((todo, index) => {
        const { title } = todo;
        const unregisteredSearchText: string = searchInput.toLowerCase();

        const {
          searchedTitle: titleFragments,
          searchInput: input,
          ...resetedTodo
        } = todo;

        if (title.toLowerCase().includes(unregisteredSearchText)) {
          const re = new RegExp(unregisteredSearchText, 'ig');
          let match;
          let matchesIndexes: Array<number> = [];
          while ((match = re.exec(title)) != null) {
            matchesIndexes.push(match.index);
          }

          let searchedTitle: string[] = [];
          const unregisteredSearchTextLength = unregisteredSearchText.length;
          const matchesIndexesLength = matchesIndexes.length;
          matchesIndexes.forEach((matchesIndex, index) => {
            if (index === 0) {
              searchedTitle.push(title.slice(0, matchesIndex));
              searchedTitle.push(title.slice(matchesIndex, matchesIndex + unregisteredSearchTextLength));
              if (matchesIndexesLength === 1) {
                searchedTitle.push(title.slice(matchesIndex + unregisteredSearchTextLength));
              }
            } else if (index === matchesIndexes.length - 1) {
              searchedTitle.push(title.slice((matchesIndexes[index - 1] + unregisteredSearchTextLength), matchesIndex));
              searchedTitle.push(title.slice(matchesIndex, matchesIndex + unregisteredSearchTextLength));
              searchedTitle.push(title.slice(matchesIndex + unregisteredSearchTextLength));
            } else {
              searchedTitle.push(title.slice((matchesIndexes[index - 1] + unregisteredSearchTextLength), matchesIndex));
              searchedTitle.push(title.slice(matchesIndex));
            }
          });
          return {
            searchedTitle,
            searchInput,
            ...resetedTodo
          }
        } else {
          return resetedTodo;
        }
      });
    });

    setSearchInput("");
  };

  const handleAddTodo = (evt: React.FormEvent) => {
    evt.preventDefault();
    if (!input) {
      setError("Type something");
      return;
    }

    addTodo({
      variables: {
        title: { title: input },
      },
    })
      .then(({ data }) => {
        setTodos((prev) => [data.addTodo, ...prev]);
      })
      .catch((err) => setError(err.message));

    setInput("");
  };

  const handleRemoveTodo = (id: string) => {
    removeTodo({
      variables: {
        id: id,
      },
    })
      .then(() => setTodos((prev) => prev.filter((el) => el.id !== id)))
      .catch((err) => setError(err.message));
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo({
      variables: {
        id: id,
      },
    })
      .then(({ data }) => setTodos(data.updateTodo))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    if (!allTodos) {
      return;
    }
    setTodos(allTodos?.getAllTodos);
  }, [allTodos]);

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 6000);
    }
  }, [error]);

  useEffect(() => {
    if (
      addTodoLoading ||
      removeTodoLoading ||
      getAllTodosLoading ||
      toggleTodoLoading === true
    ) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [
    addTodoLoading,
    removeTodoLoading,
    getAllTodosLoading,
    toggleTodoLoading,
  ]);

  return (
    <>
      {loading ? <LinearProgress className="loader" /> : null}
      <div className="container">
        <Header />
        <Error error={error} />
        <form autoComplete="off" onSubmit={handleSearch}>
          <TextField
            // id="standard-basic"
            style={{
              width: "50%",
            }}
            label="Enter search text"
            variant="standard"
            color="primary"
            value={searchInput}
            onChange={(evt) => setSearchInput(evt.target.value)}
          />
        </form>
        <form autoComplete="off" onSubmit={handleAddTodo}>
          <TextField
            id="standard-basic"
            style={{
              width: "100%",
            }}
            label="Add your todo"
            variant="standard"
            color="primary"
            value={input}
            onChange={(evt) => setInput(evt.target.value)}
          />
        </form>
        <CSSTransition
          in={todos.length !== 0}
          timeout={250}
          classNames="transition-list"
        >
          <List
            todos={todos}
            removeTodo={handleRemoveTodo}
            toggleTodo={handleToggleTodo}
          />
        </CSSTransition>
      </div>
    </>
  );
};

export default App;
