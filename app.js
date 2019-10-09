
// KontrolorBudzeta
var KontrolorBudzeta =(function(){
    var Expense = function(id,description,value){
      this.id= id; this.description= description; this.value= value;  
        this.percentage = -1;
    };
    
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome>0){this.percentage = Math.round((this.value / totalIncome) *100);}
        else {this.percentage = -1;}
        
    };
    
    Expense.prototype.getPercentage = function(){
      return this.percentage;  
    };
    
    
    var Income = function(id,description,value){
      this.id= id; this.description= description; this.value= value;  
    };
    
    var allExpenses =[];
    var allIncomes = [];
    var totalExpenses = 0;
    
    var calculateTotal = function(type){
        var sum=0;   data.allItems[type].forEach(function(cur){
            sum=sum+cur.value;
        });
        data.totals[type] = sum;
    };
    
    var data ={
        allItems: {
            exp:[],
            inc:[]    
        },
        totals:{
            exp:0,
            inc:0
            
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des,val){
            var newItem,ID;
            // Novi id
            if(data.allItems[type].length>0){
                ID =data.allItems[type][data.allItems[type].length-1].id +1;
            } else {ID=0};
            
            
            // novi objekat
            if (type==="exp"){ newItem =  new Expense(ID,des,val);} else if (type==="inc"){
                newItem =  new Income(ID,des,val);
            }
            // dodavanje u niz
            data.allItems[type].push(newItem);
            //vracanje novog elem
            return newItem; 
        },
        
        deleteItem: function(type, id){
          
         var ids =  data.allItems[type].map(function(current){
             return current.id;
         });
          var  index = ids.indexOf(id);
            if(index !== -1){
                data.allItems[type].splice(index,1);
            }
            
            
        },
        
        calculateBudget: function(){
            // izr prihoda i rashoda
            calculateTotal("exp");
            calculateTotal("inc");
            // budzet
            data.budget= data.totals.inc-data.totals.exp;
            //procenti
            if(data.totals.inc>0){
            data.percentage= Math.round((data.totals.exp / data.totals.inc)*100);} else{data.percentage=-1}
        },
        
        calculatePercentages: function(){
            
            data.allItems.exp.forEach(function(cur){cur.calcPercentage(data.totals.inc);})   
        },
        
        getPercentages: function(){
            
            var allPerc = data.allItems.exp.map(function(cur){return cur.getPercentage();});
            return allPerc;
        },
        
        getBudget: function(){
            return {
                budget:data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        
        testing: function(){console.log(data);}
    };
    
    
})();



// UIKontrolor
 var UIKontrolor =(function(){
     
     var DOMstrings = {
         inputType: ".add__type",
         inputDescription:".add__description",
         inputValue:".add__value",
         inputBtn:".add__btn",
         incomeContainer:".income__list",
         expensesContainer:".expenses__list",
         budgetLabel:".budget__value",
         incomeLabel:".budget__income--value",
         expensesLabel:".budget__expenses--value",
         percentageLabel:".budget__expenses--percentage",
         container:".container",
         expensesPercentageLAbel:".item__percentage",
         dateLabel: ".budget__title--month"
     };
     
          var nodeListForEach = function(list, callback){
                 for (var i=0;i < list.length;i++){
                     callback(list[i], i);
                 }
             };
     
     
     return {
         getInput: function(){
             return {
             type : document.querySelector(DOMstrings.inputType).value, // inc exp
             description : document.querySelector(DOMstrings.inputDescription).value,
              value : parseFloat( document.querySelector(DOMstrings.inputValue).value)
             };
         },
         addListItem: function(obj,type){
        var html,element;
             // HTML string
           if(type==="inc"){  
               element = DOMstrings.incomeContainer;
       html =   '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ;  } else if(type==="exp"){
           element = DOMstrings.expensesContainer;
           html =     '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
       }   
        //Zamena 
             newHtml = html.replace("%id%",obj.id);
             newHtml = newHtml.replace("%description%",obj.description);
             newHtml = newHtml.replace("%value%", this.formatNumber(obj.value, type));
             
         // html u dom   
             document.querySelector(element).insertAdjacentHTML("beforeend",newHtml);
             
    }, 
         
         deleteListItem: function(selectorID){
             var el = document.getElementById(selectorID);
             el.parentNode.removeChild(el);
             //document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID))
         },
         
         
         
         clearFields: function(){
        var fields =     document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
         var  fieldsArray =  Array.prototype.slice.call(fields);
             
            fieldsArray.forEach(function(current, index, array){
                current.value ="";
            });
             fieldsArray[0].focus();
         },
         
         displayBudget: function(obj){
             document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
             document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
             document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
             
       if(obj.percentage>0){document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";}
             else {document.querySelector(DOMstrings.percentageLabel).textContent ="---";}
         },
         
         displayPercentages: function(percentages){
             
             var fields = document.querySelectorAll(DOMstrings.expensesPercentageLAbel);
             
        
             
             nodeListForEach(fields, function(current, index){
                 
                 if(percentages[index]>0){current.textContent = percentages[index] + '%';} else{current.textContent= '---';}
                 
                 
             });
             
             
             
         },
         
         formatNumber: function(num, type){
             // + ili minus pre broja , dve decimale i zarez u slucaju hiljada
             var type,sign;
             num = Math.abs(num);
             num = num.toFixed(2);
             
             var numSplit = num.split('.');
             var int = numSplit[0];
             if(int.length>3){
               int =  int.substr(0,int.length-3) + "," + int.substr(int.length-3,3);
             }
             var decimal = numSplit[1];
             return (type === "exp" ? sign = "-" : "+") + " " + int + "." + decimal;
             
         },
         
         displayMonth: function(){
             var month;
             var now = new Date();
             month= now.getMonth();
             var year = now.getFullYear();
             var months = ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
             
             document.querySelector(DOMstrings.dateLabel).textContent= months[month]+" " + year;
         },
         
         changedType: function(){
             
             var fields = document.querySelectorAll(
             DOMstrings.inputType, + "," +
                 DOMstrings.inputDescription + "," +
                 DOMstrings.inputValue);
             
             nodeListForEach(fields, function(cur){
                 cur.classList.toggle("red-focus");
             });
             document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
             document.querySelector(DOMstrings.inputDescription).classList.toggle("red-focus");
         },
         
         
         getDOMstrings: function(){
             return DOMstrings;
         }
    
     };
     
     
     
 })();



//AplikacioniKontrolor , globalna kontrola
var AplikacioniKontrolor= (function(KontrolorB,UIKontrol){
    
    var setupEventL = function(){
        var DOM =UIKontrol.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener("click", KontrDodavanja);
    
    //keyCode
    document.addEventListener("keypress", function(event){
        if(event.keyCode===13 || event.which===13){KontrDodavanja();}
    });
        
      document.querySelector(DOM.container).addEventListener("click", ctrlDeleteItem); 
        
        document.querySelector(DOM.inputType).addEventListener("change", UIKontrolor.changedType);
        
    };
    
    
    
    var updateBudget= function(){
        //izracunavanje budzeta
        KontrolorBudzeta.calculateBudget();
        // vraca budzet
        var budget = KontrolorBudzeta.getBudget();
        // prikaz budzeta
       UIKontrol.displayBudget(budget);
    };
    
    var updateProcenata = function(){
        // 1 racunanje 
        KontrolorBudzeta.calculatePercentages();
        // 2 iz budzet kontrole
      var percentages =  KontrolorBudzeta.getPercentages();
        // 3 update user interface
        UIKontrolor.displayPercentages(percentages);
    };
    
    
    var KontrDodavanja = function(){
        console.log("radi");
            //uzeti imput
        var input = UIKontrol.getInput();
        console.log(input);
        
        if(input.description !=="" && !isNaN(input.value) && input.value>0){
        
        //dodati element kontr budzeta
       var newItem = KontrolorBudzeta.addItem(input.type, input.description, input.value);
        
        // dodato ui kontroloru
        UIKontrolor.addListItem(newItem,input.type);
        
        // Brisanje
        UIKontrolor.clearFields();
        
        // 
        updateBudget();
        updateProcenata();
            
        }    
    };
    
    var ctrlDeleteItem = function(event){
    var  itemID =  event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            
            var splitID = itemID.split("-");
          var  type = splitID[0];
            var ID = parseInt(splitID[1]);
            
            // brisanje iz strukture
            KontrolorBudzeta.deleteItem(type,ID);
            //brisanje iz UI 
            UIKontrol.deleteListItem(itemID);
            // novi budzet
            updateBudget();
            updateProcenata();
        }
    };
    
    return {
        init: function(){
            console.log("Aplikacija radi");
            UIKontrolor.displayMonth();
            UIKontrol.displayBudget({
                budget:0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventL();
        }
    };
    
    
})(KontrolorBudzeta,UIKontrolor);

AplikacioniKontrolor.init();