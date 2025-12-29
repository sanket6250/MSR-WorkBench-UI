//React

//React is a front-end JavaScript library. (It is also known as React.js or ReactJS.)

//How It Works
/*
							User Operation
								 |
					React creates a VIRTUAL DOM in memory.	
					(Instead of manipulating the browser's DOM directly, React creates a virtual DOM in memory, where it does all the necessary manipulating, before making the changes in the browser DOM.)
								 |
					React only changes what needs to be changed!	

*/			

//To use React in production, you need npm which is included with Node.js.
//Also, you need to set up a React Environment, and choose a build tool.  //Required Operation

/*
1. Running React Without a Build Tool
	.Including the React library directly via script tags:
	.Creating a simple static HTML file:
	
	Limitations of this approach:
		.Performance is poor because JSX is translated in the browser on the fly [1].
		.It is not suitable for production use due to lack of optimization and increased load  times [1]. 
	
2. Running React With a Build Tool
		(For most real-world React projects, a build tool is effectively required. Tools like Vite or Create React App (CRA) handle crucial tasks automatically: )
		
	Transforming JSX:	
					Build tools use compilers (like Babel or SWC) to turn JSX syntax into standard JavaScript that browsers can understand before the code is sent to the user [1].
	Bundling Modules: 
	Optimizing Performance:
							Enabling Modern Features:  (facilitate (ES6+), TypeScript, CSS preprocessors, and testing frameworks [1]. )
							
Steps to create React Environment :
								Install nodejs
								      |
						 npm install -g create-vite (Install Build Tool Vite)
									  |
						npm create vite@latest my-react-app -- --template react 
																(It will create my-react-app react project)
									  |
							cd my-react-app (Go to project path)
							          |
								npm install (Add all required dependencies)
								      |
								  npm run dev	  (Run the react application)
*/		

//React Render DOM 

/*
React renders HTML to the web page via a container, and a function called createRoot().

The Container
React uses a container to render HTML in a web page.

Typically, this container is a <div id="root"></div> element in the index.html file.

//Important
The createRoot function is located in the main.jsx file in the src folder, and is a built-in function that is used to create a root node for a React application.

The createRoot() function takes one argument, an HTML element.

The purpose of the function is to define the HTML element where a React component should be displayed.

*/
//main.jsx file 
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

//Render Method (.render())
//The render method defines what to render in the HTML container.
//The result is displayed in the <div id="root"> element.

// Before  - (React 17.)
import ReactDOM from 'react-dom';

ReactDOM.render(
 <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);

// After  - (React 19.)
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

/* 
React uses ES6, and you should be familiar with some of the new features like:

		.Classes
		.Arrow Functions
		.Variables (let, const, var)
		.Array Methods like .map()
		.Destructuring
		.Modules
		.Ternary Operator
		.Spread Operator 
		
Before ES6 there was only one way of defining your variables: with the var keyword.
		
With ES6, there are three ways of defining your variables: var, let, and const.

	.var - (has a function scope, not a block scope.)
	.let - (has a block scope.)
	.const - (has a block scope.)
*/

//JavaScript Array map() -
/*
						When using map() in React to create list items, each item needs a unique key prop.
						The map() method takes three parameters:

							.currentValue - The current element being processed
							.index - The index of the current element (optional)
							.array - The array that map was called upon (optional)
							
						The map() method always returns a new array. It does not modify the original array.	
*/
//ex:-
const fruitlist = ['apple', 'banana', 'cherry'];
fruitlist.map((fruit, index, array) => {
        return (
          <li key={fruit}>
            Number: {fruit}, Index: {index}, Array: {array}
          </li>
        );
      })

//Destructuring in React:
/*
				-  Destructuring makes React code cleaner and more readable by reducing repetitive object and array access.
				- When destructuring arrays, the order that variables are declared is important.
*/
//Destructuring Arrays
	//ex:-
	const vehicles = ['mustang', 'f-150', 'expedition'];
	const [car,, suv] = vehicles;


	function dateInfo(dat) {
	  const d = dat.getDate();
	  const m = dat.getMonth() + 1;
	  const y = dat.getFullYear();

	  return [d, m, y];
	}
	const [date, month, year] = dateInfo(new Date());

//Destructuring Objects
	//ex:-
	const person = {
	  firstName: "John",
	  lastName: "Doe",
	  age: 50,
	  car: {
		brand: 'Ford',
		model: 'Mustang',
	  }
	};

	// Destructuring
	let {firstName, car: { brand, model }} = person;

	let message = `My name is ${firstName}, and I drive a ${brand} ${model}.`;
	
//Destructuring is particularly useful in React for working with props, hooks, and API responses. It helps make your code more concise and easier to read.

//Using destructuring to extract props:
import { createRoot } from 'react-dom/client'
					
		//Here instead of direct destructuring props , we can pass prop as paramter then we will fecth respective value from this like function (Greeting(props)){props.name}
function Greeting({ name, age }) {  
  return <h1>Hello, {name}! You are {age} years old.</h1>;
}
  
createRoot(document.getElementById('root')).render(
  <Greeting name="John" age={25} />
);	

//useState Hook Destructuring:
			//When a component uses the useState hook, we use destructuring to extract the values from it.
import { createRoot, useState } from 'react-dom/client'

//By using this function component we can show incremental Counter value in DOM.
function Counter() {   
  // Destructuring the array returned by useState
  const [count, setCount] = useState(0); //Default value we set it as 0.
  
  return (  			//By using hook we will update count by incerementing 1
    <button onClick={() => setCount(count + 1)}>   
      Count: {count}//Always show latest value as per updated state of that variable
    </button>
  );
}			

//Spread Operator:
				//-The JavaScript spread operator (...) allows us to quickly copy all or part of an existing array or object into another array or object.
				
	//Construct New JSON from available json objs
		const numbersOne = [1, 2, 3];
		const numbersTwo = [4, 5, 6];
		const numbersCombined = [...numbersOne, ...numbersTwo];	
		
	//Destruct JSON obj using spread Operator
		const numbers = [1, 2, 3, 4, 5, 6];
		const [one, two, ...rest] = numbers;  //...rest create new array of remaining elements from numbers ex: [3,4,5,6]
		
		//Important
		//Notice that the properties that did not match were added, and the property that did match was overwritten by the last object.		
		const car = {
		  brand: 'Ford',
		  model: 'Mustang',
		  color: 'red'
		}

		const car_more = {
		  type: 'car',
		  year: 2021, 
		  color: 'yellow'
		}
		const mycar = {...car, ...car_more} //Here Color attr override by car_more
		
//ES6 Modules:

/*
Modules
	.JavaScript modules allow you to break up your code into separate files.

	.This makes it easier to maintain the code-base.

	.ES Modules rely on the import and export statements.
	
Export
	.You can export a function or variable from any file.	
	.There are two types of exports: Named and Default. (You can only have one default export in a file.)
	
		Named Export :
			const name = "Tobias" 
			const age = 18
			export { name, age }
			   OR
			export const name = "Tobias"
			export const age = 18

		Default Export :
			const message = () => {
			  const name = "Tobias";
			  const age = 18;
			  return name + ' is ' + age + 'years old.';
			};

			export default message;
			
Import 
	.You can import modules into a file in two ways, based on if they are named exports or default exports.	
	.Named exports must be destructured using curly braces. Default exports do not.	 (Important)
	
	import { name, age } from "./person.js";   -----> Named Export
	import message from "./message.js";        ------> Default Export
	
*/	
	
	