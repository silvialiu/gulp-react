/*
var hello = require('../mod/hello_com'),
	Foo = require('../mod/foo');
hello.invoke();
*/
//console.log(HelloMessage);
/*
React.renderComponent(HelloMessage(), 
    document.getElementById('body'));
*/
//Foo();
var HelloMessage = require('../mod/hello_com');
    React.renderComponent(
        <HelloMessage name="abc" />,
        document.querySelector('body')
    )


console.log('222');
