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
// total income
var totalIncome = 0;
// total expense
var totalExpense = 0;

//update table content
var updateTable = function(){
	for(var i = 0; i < records.length; i++) {
			var record = records[i];
			addBudgetItem(record.type, record.amount);						
		}
		retrieveTotalValue();
}

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
		var para = document.createElement("p");
		para.setAttribute("class", "delete");
		para.innerHTML = "delete";
		outterDiv.appendChild(para);
		
		list.prepend(outterDiv);
		para.addEventListener("click", function(){
			outterDiv.remove();
			retrieveTotalValue(type, dollar);
			// check if is current item
			var curItem = records.find(function(record){
				return record.date === curItem && Number(record.amount) === Number(dollar);
			});
			var index = records.indexOf(curItem);
			// The splice() method changes the contents of an array by removing
			// or replacing existing elements and/or adding new elements in place
			records.splice(index,1);
			// update localstorage
			localStorage.setItem("records", JSON.stringify(records));
		});
}

// retrieve total value 
var retrieveTotalValue = function(type, amount) {
	var TotalAmount = document.getElementById("totalAmount");
	if(type && amount) {
		if(type == "income") {
			TotalAmount.innerHTML = localStorage.getItem("total") - amount;	
			localStorage.setItem("total", localStorage.getItem("total") - amount);
		} else if (type == "expense") {
			// TotalAmount.innerHTML = (localStorage.getItem("total") + amount);
			// localStorage.setItem("total", localStorage.getItem("total") + amount);
			TotalAmount.innerHTML = (localStorage.getItem("total") - (amount*-1));
			localStorage.setItem("total", localStorage.getItem("total") - (amount*-1));
		}
		
	} else {
		TotalAmount.innerHTML = localStorage.getItem("total");
	}
	
	if(parseFloat(JSON.parse(localStorage.getItem("total"))) >= 0) {
		TotalAmount.setAttribute("class", "number pos");
	} else {
		TotalAmount.setAttribute("class", "number neg");
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
		updateTable();
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

// tab page for all
$("#filter-all").click(function() {
	$("#filter-income").removeClass('active');
	$("#filter-expense").removeClass('active');
	$("#filter-all").addClass('active');
	$(".expense").show();
	$(".income").show();
})

// tab page for income
$("#filter-income").click(function() {
	$("#filter-income").addClass('active');	
	$("#filter-expense").removeClass('active');
	$("#filter-all").removeClass('active');
	$(".expense").hide();
	$(".income").show();
})

// tab page for expense
$("#filter-expense").click(function() {
	$("#filter-income").removeClass('active');	
	$("#filter-expense").addClass('active');
	$("#filter-all").removeClass('active');
	$(".expense").show();
	$(".income").hide();
})

var getCurrentInAndOut = function(month, year) {
	for(var i = 0; i < records.length; i++) {
			var record = records[i];
			var string = record.date.split(" ");
			console.log(string);
			if(string[0] == months[month] && string[2] == year) {
				if(record.type == "income") {
					totalIncome += 	parseInt(record.amount);
				} 
				if(record.type == "expense"){
					totalExpense +=	parseInt(record.amount);
				}	
			} else {
				alert("No data in choosen date! Please select another date.")
			}
		}
}

$(".monthlyResult").click(function() {
	var date = new Date($("#start").val());
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	getCurrentInAndOut(month, year);
	showMonth(month, year);
})

var showMonth = function(month, year) {
var realmonth = month + 1;
var chart = new CanvasJS.Chart("chartContainer", {
	
	animationEnabled: true,
	title: {
		text: "Pie Chart For " + realmonth + ", " + year
	},
	data: [{
		type: "pie",
		startAngle: 240,
		yValueFormatString: "\"$\"##",
		indexLabel: "{label} {y}",
		dataPoints: [
			{y: totalIncome, label: "Income"},
			{y: totalExpense, label: "Expense"},
			
		]
	}]
});
chart.render();

}