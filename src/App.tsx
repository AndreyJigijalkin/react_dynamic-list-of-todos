import React, { useState, useEffect } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';

import { getTodos } from './api';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectType, setSelectType] = useState('All');
  const [input, setInput] = useState('');
  const [todoId, setTodoId] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTodos()
        .then(response => {
          setTodos(response);
          setIsLoading(false);
        });

      return data;
    };

    fetchData();
  }, []);

  const visibleTodos = todos
    .filter(todo => {
      switch (selectType) {
        case 'active':
          return !todo.completed;

        case 'completed':
          return todo.completed;

        default:
          return true;
      }
    })
    .filter(todo => {
      return todo.title.toLowerCase().includes(input.toLowerCase());
    });

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                onSelect={setSelectType}
                selectValue={selectType}
                onInput={setInput}
                inputValue={input}
              />
            </div>

            <div className="block">
              {isLoading
                ? <Loader />
                : (
                  <TodoList
                    todos={visibleTodos}
                    selectTodo={setTodoId}
                    selectedTodoId={todoId}
                  />
                )}
            </div>
          </div>
        </div>
      </div>

      {todoId
        && (
          <TodoModal
            selectedTodoId={todoId}
            todos={visibleTodos}
            selectTodo={setTodoId}
          />
        )}
    </>
  );
};
