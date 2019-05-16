import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./App.css";

function Todo({ todo, index, completeTodo, removeTodo }) {
    return (
    <div className="todo" style={{ 
        textDecoration: todo.isCompleted ? "line-through" : "" ,
        color: todo.isCompleted ? "#808080" : "" ,
        }}>
        
        <div className="text">
            {todo.text}  
        </div>
        
        <div>
            <button className="btn" onClick={() => completeTodo(index, todo.id, todo.isCompleted)}>{todo.isCompleted ? "Undo" : "Complete" }</button>
            <button className="btn" onClick={() => removeTodo(index, todo.id)}>X</button>
        </div>
    </div>
);
}

function TodoForm({ addTodo }) {
    const [value, setValue] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        if (!value) return;
        addTodo(value);
        setValue("");
    };

    return (
        <div className="inputDiv">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="input"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder="Add item then press enter"
                />
            </form>  
        </div>
       
);
}

function App() {
    
    const initList = [
        {
            text: "shampoo",
            isCompleted: false
        },
        {
            text: "cat food",
            isCompleted: false
        },
        {
            text: "soy milk",
            isCompleted: true
        },
        {
            text: "soap",
            isCompleted: true
        },
        {
            text: "pick up dry cleaning",
            isCompleted: false
        },
    ]
    const [todos, setTodos] = useState(initList);
    const [bulk, setBulk] = useState('');
    let [checked, setChecked] = useState(0);
    let [bulkMode, setBulkMode] = useState(true);

    
    //Fetch data from API and set it to state on render
    useEffect(() => {
        const fetchData = async () => {
            

            let count = 0;
            
            for (let item of todos){
                if(item.isCompleted === true) {
                    count++
                }
            }
            setChecked(count)
            
        };

        fetchData();

        
    });
    
    
    //Add a new item in the list
    const addTodo = text => {
        const newItem = [{text: text, isCompleted: false}];
        setTodos(todos.concat(newItem));
        console.log(todos)
    };
    
    //Toggle isCompleted boolean status
    const completeTodo = (index, id, isCompleted) => {
        const newTodos = [...todos];
        todos[index].isCompleted = !todos[index].isCompleted;
        todos[index].isCompleted ? setChecked(checked+=1) : setChecked(checked-+1);    
        setTodos(newTodos);
        
    };
    
    //Submit button handler for bulk item
    
    const submitBulk = () => {
        
        const bulkarr = []
        
        for (let item of bulk.split(/\n/)) {
            bulkarr.push({text: item, isCompleted: false})
        }

        setTodos(todos.concat(bulkarr));
        setBulk('')
    }
    
    //Remove one item from the shopping list
    const removeTodo = (index, id) => {
        console.log(id)
        const newTodos = [...todos];
        newTodos.splice(index, 1);
        setTodos(newTodos);
    };
    
    const list = () => {  
        
        let arr = [];
        
        todos.map((todo, index) => (
            arr.push(<Todo
                key={index}
                index={index}
                todo={todo}
                completeTodo={completeTodo}
                removeTodo={removeTodo}
            >
            </Todo>)
        ))
        
        
        return arr.sort((a, b) => { return a.props.todo.isCompleted - b.props.todo.isCompleted});
    }

    return (
        <div className="app">
            {bulkMode &&
                <button className="btn blankBtn blkModeBtn" onClick={e => setBulkMode(!bulkMode)}>{bulkMode ? "Add Multiple Entries" : "Add Single Entries"}</button>
            }
            
            {bulkMode &&
            <TodoForm addTodo={addTodo} />
            }

           
            
            {!bulkMode &&
            <div className="inputDiv">
                <button className="btn blankBtn blkModeBtn" onClick={e => setBulkMode(!bulkMode)}>{bulkMode ? "Bulk Mode" : "Add Single Entries"}</button>
                <textarea className="textarea" placeholder="Add bulk entries here. Separate each entry with a new line" value={bulk} onChange={e => setBulk(e.target.value)}></textarea>
                <div className="btnrow">
                    <button className="btn bulkBtn " onClick={()=> submitBulk()}>Submit</button>
                </div>
                
            </div>
            }

            <div className="todo-list">
                {todos.length > 0 &&
                <div className="count">{checked}/{todos.length} items completed</div>
                }
                
                
                {list()}
                {todos.length === 0 &&
                <div className="empty">Shopping list empty. Add a new item in the form above.</div>
                }
            </div>

          
            
        </div>
     );
    }

export default App;