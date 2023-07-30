### **1- What is the difference between Component and PureComponent? Give an example where it might break my app.**

Component is when you want to use the default behavior of React, preferred in most cases.

PureComponents doesn’t re-render if you have the same props or state, so they are good for simple components that have simple state or props.

If you are passing complex data to a PureComponent it might break your app because pure components only shallowly compares the previous data to the current one, so it might not re-render when it should.

### **2. Context + ShouldComponentUpdate might be dangerous. Why is that?**

When changing data via context all components subscribed to the context will call ShouldComponentUpdate even if their props/state haven’t changed, this may cause unexpected behaviors and unnecessary re-renders.

Some libraries like use-context-selector are used instead of the native React context api because of that. When you use useContextSelector your component will only re-render if the specific value you got from the context changes instead of re-rendering when any value related to the context changes. 

We used this library when developing Houston, a React component library, since most products at Eduzz were using the library we wanted to make sure we were not causing unnecessary re-renders.


### **3. Describe 3 ways to pass information from a component to its PARENT.**

The most common way is to pass a function that receives an argument from the parent to the child, that way you can just pass data from the child as an argument and the parent will have access to it.

You also could use context which has a similar idea, or a state-management-library like Redux where you can dispatch an action with the data from the child and the parent can connect to the Redux store and retrieve this data.

One more controversial way that I used in some cases is to just pass data to the window object, you assign a value like this in the child : window[‘data’] = data and since you can access the window everywhere in your app you can access it from the parent. I’ve actually used this where the state of the form was in the children but the parent needed access to this information.

### **4. Give 2 ways to prevent components from re-rendering.**


React.memo is good for simple components, it works similar as PureComponent, if a memoized component receives the same props as before it will not re-render. 

It is a good idea if you have a big parent component with complex state and props to create ‘static’ (no state) subcomponents and wrap them with React.memo, so these subcomponents won’t necessarily re-render when the parent component state or props change. 

If you are passing a function to a memoized component you also have to make sure that function is wrapped in a useCallback hook, otherwise it will think it is a new function every time and it will re-render.

We used these techniques a lot in Houston to prevent unnecessary re-renders. 

Another way to prevent re-rendering is to save state in useRef hooks instead of useState, if you need a variable that changes over time and you don’t need the screen to be re-rendered when that state updates useRef is the way to go.

### **5. What is a fragment and why do we need it? Give an example where it might break my app.**

Fragment is like an invisible parent div, we need it because React can only render a single JSX component, so sometimes we need to wrap a JSX in a fragment. Example : 

`data.map(item =>  <label>Name</label><input/>)   (two JSX)`

React won’t understand this and this may break our app so we do this instead : 

`data.map(item =>  <><label>Name</label><input/></>) (a single JSX)`

The “<>” element is the React Fragment, now React treats this as single JSX and it will render the data.

### **6. Give 3 examples of the HOC pattern.**

I used this pattern when using Redux, that pattern was often used to connect a component to a Redux Store, it would be something like  : 

connect(Component). That ‘connect’ would return a new component that has access to the Redux Store.

React.memo is also an example of a HOC, it returns a new component that is capable of checking if the props are equal than before and if it is not re-render. 

I also used something like this at the backoffice at Eduzz : 
```
<UserValidation>
   <Component/>
</UserValidation>
```

The component ‘UserValidation’ would receive the ‘Component’ and check if the user had the permissions to access that component.

### **7. What's the difference in handling exceptions in promises, callbacks and async…await?**

As far as I know the main difference is you do a try/catch block when using callbacks, async/ await and .catch when using promises.


### **8. How many arguments does setState take and why is it async.**

setState can take a single argument if you just want to update the state.

Or it can take a callback argument where you have access to the previous state and the callback will be executed right after the state updates.

setState is async because it batches all state updates to be executed at once, so if you want to do something after React finishes updating the state you should use setState with the callback.


### **9. List the steps needed to migrate a Class to Function Component.**

Change Class to function, change this.props to (props) where you receive the props as the function argument, change this.state to setState, change the methods inside the class to be regular functions and change the render() method to ‘return’.

### **10. List a few ways styles can be used with components.**

You can style with inline styles like : 
```
<div style={{color:’blue’, display:’flex’}}>Data</div>
```

You can use regular classes :
```
<div className=’data’>Data</div>
```

This way you need to define the classes somewhere like in a .css file or use a style library like Tailwind where you have a lot of predefined classes.

You can use css modules : 
```
<div className={styles.data}>Data</div>
```

This way you need to have a data selector in a styles.modules.css file and import it in the component.

You can use styled components which is something like : 

```
 const StyledComponent = styled(Component)(‘
     .data {
		    display: ‘flex’
    	}
	’)
```