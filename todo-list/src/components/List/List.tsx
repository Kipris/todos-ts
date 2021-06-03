import { Checkbox } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import { Todo } from "../../interfaces";
import "./List.css";

interface ListProps {
  todos?: Todo[];
  removeTodo(id: string): void;
  toggleTodo(id: string): void;
}

const getHighlightedText = (todo: Todo) => {
  const {title, searchedTitle, searchInput} = todo;
  if (!searchedTitle || !searchInput) {
    return title;
  }
  return searchedTitle.map((text, index) => (
    text.toLowerCase() === searchInput.toLowerCase() ?
      (
        <b key={index}>{text}</b>
      )
      : text
  ));
}

const List: React.FC<ListProps> = ({ todos, removeTodo, toggleTodo }) => {
  console.log(todos);
  if (todos && todos.length !== 0) {
    return (
      <ul className="todo-list">
        {todos.map((el: Todo) => {
          return (
            <ListItem
              key={el.id}
              dense
              button
              divider
              onClick={() => toggleTodo(el.id)}
            >
              <ListItemIcon>
                <Checkbox checked={el.completed} />
              </ListItemIcon>
              <ListItemText
                primary={getHighlightedText(el)}
                style={
                  el.completed ? { textDecoration: "line-through" } : undefined
                }
              />
              <ListItemSecondaryAction onClick={() => removeTodo(el.id)}>
                <IconButton className="delete-button">
                  <DeleteIcon className="delete-icon" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </ul>
    );
  } else {
    return <div className="addTodos-placeholder">No todos yet!</div>;
  }
};

export default List;
