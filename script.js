// delear local storage variable
var records = JSON.parse(localStorage.getItem("records"));
// get income button
var income = document.getElementsByClassName("addIncome")[0];
// get expense button
var expense = document.getElementsByClassName("addExpense")[0];
// input from income
var incomeValue = document.getElementById("incomeAmount");
// input from expense
var expenseValue = document.getElementById("expenseAmount");
// get list 
var list = document.getElementsByClassName("list")[0];
// months in a year
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var addBudgetItem = function(type, dollar){
	var outterDiv = document.createElement("div");
		outterDiv.setAttribute("class", "budget-item " + type);
		var div = document.createElement("div");
		var number = document.createElement("h4");
		if(type == "income") {
			number.innerHTML = "$" + dollar;	
		} else {
			number.innerHTML = "-$" + dollar;
		}
		
		var span = document.createElement("span");
		var d = new Date();
		span.innerHTML = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
		div.appendChild(number);
		div.appendChild(span);
		outterDiv.appendChild(div);
		var p = document.createElement("p");
		p.setAttribute("class", "delete");
		p.innerHTML = "delete";
		outterDiv.appendChild(p);
		
		list.prepend(outterDiv);
		// data.push(outterDiv.outerHTML);
		// localStorage.setItem("info",JSON.stringify(data));
		p.addEventListener("click", function(){
			outterDiv.remove();
			localStorage.removeItem(this);
		});
}

// retrieve total value 
var retrieveTotalValue = function() {
	document.getElementById("totalAmount").innerHTML = localStorage.getItem("total");
	if(parseFloat(JSON.parse(localStorage.getItem("total"))) >= 0) {
		document.getElementById("totalAmount").setAttribute("class", "number pos");
	} else {
		document.getElementById("totalAmount").setAttribute("class", "number neg");
	}
}

// initialization
var initial = once(function() {
	if(!localStorage.getItem("total")) {
		localStorage.setItem("total", 0);
	
	}
	retrieveTotalValue();
	if(!records) {	
		records = [];
	} else {
		for(var i = 0; i < records.length; i++) {
			var record = records[i];
			addBudgetItem(record.type, record.amount);
			retrieveTotalValue();
		}
	}
})

initial();

income.onclick = function() {
	if(incomeValue.value && incomeValue.value > 0){
		var amount = parseFloat(JSON.parse(localStorage.getItem("total")));
		amount += parseFloat(incomeValue.value);
		localStorage.setItem("total", amount);	
		retrieveTotalValue();
		amount = "$" + amount;

		addBudgetItem("income", incomeValue.value);

		add("income",incomeValue.value);
		incomeValue.value = "";	
	} else {
		console.error('Please input a valid number.');
	}
	
}

expense.onclick = function() {
	if(expenseValue.value && expenseValue.value > 0){
		var amount = parseFloat(JSON.parse(localStorage.getItem("total")));
		amount -= parseFloat(expenseValue.value);
		localStorage.setItem("total", amount);
		retrieveTotalValue();
		amount = Math.abs(amount);
		amount = "- $" + amount;

		addBudgetItem("expense",expenseValue.value);

		add("expense",expenseValue.value);
		expenseValue.value = "";	
	} else {
		console.error('Please input a valid number.');
	}
}





//can only call once
function once(fn, context) { 
	var result;

	return function() { 
		if(fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

var add = function(category,dollar) {
	var d = new Date();
	records.push({
		type: category,
		amount: dollar,
		date: months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear(),
	})
	localStorage.setItem("records", JSON.stringify(records));
}