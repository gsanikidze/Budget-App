function selector(select) {
  return document.querySelector(select)
}
// counter for finding elements in array
var counterInc,
  counterExp;
counterInc = 1;
counterExp = 1;

/*!!! Data - save values !!!*/
var budgetController = (function() {
  var Expence = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var data = {
    allItams: {
      exp: [],
      inc: []
    },
    total: {
      exp: 0,
      inc: 0
    },
    percent: 0,
    budget: 0
  }

  return {
    addItam: function(typ, des, vel) {
      var newItam,
        id;

      // generate unic id
      function guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
      }
      id = guid();
      // add new object
      if (typ === 'inc') {
        newItam = new Income(id, des, vel);
        data.allItams.inc.push(newItam);
        // console.log(newItam);
        // console.log(data);
      } else if (typ === 'exp') {
        newItam = new Expence(id, des, vel);
        data.allItams.exp.push(newItam);
        // console.log(newItam);
        // console.log(data);
      }
    },
    retAllItams: function() {
      return data.allItams;
    },
    returnData: function() {
      return data;
    }
  }

})();

/*!!! Update UI !!!*/
var UIController = (function() {

  // get class
  var UIComponents = {
    type: ".add__type",
    desk: ".add__description",
    money: ".add__value",
    updateInc: '.income__list',
    updateExp: '.expenses__list'
  }

  return {

    // read values
    readUIvalues: function() {
      return {
        typeOfValue: selector(UIComponents.type).value,
        description: selector(UIComponents.desk).value,
        valueOfMoney: selector(UIComponents.money).value
      }
    },
    // add new html in list
    addString: function(obj, dat) {
      var html;

      if (obj.inc.length === counterInc) {
        html = `
        <div class="item clearfix" id="${obj.inc[obj.inc.length - 1].id}">
            <div class="item__description">${obj.inc[obj.inc.length - 1].description}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.inc[obj.inc.length - 1].value}</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        counterInc++;
        selector('.income__list').insertAdjacentHTML('beforeend', html);
        //calculate total inc
        dat.total.inc += obj.inc[obj.inc.length - 1].value;
        console.log(dat.total.inc);
      } else if (obj.exp.length === counterExp) {
        html = `<div class="item clearfix" id="${obj.exp[obj.exp.length - 1].id}">
            <div class="item__description">${obj.exp[obj.exp.length - 1].description}</div>
            <div class="right clearfix">
                <div class="item__value">${obj.exp[obj.exp.length - 1].value}</div>
                <div class="item__percentage">21%</div>
                <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                </div>
            </div>
        </div>`;
        counterExp++;
        selector('.expenses__list').insertAdjacentHTML('beforeend', html);
        // calculate total exp
        dat.total.exp += obj.exp[obj.exp.length - 1].value;
      }
      //calculate budget
      dat.total.budget = dat.total.inc - dat.total.exp;
      // calculate percent
      if (dat.total.inc > 0) {
        dat.total.percent = Math.round((dat.total.exp / dat.total.inc) * 100);
      }
    },
    // clear fields after add new element
    clearFilds : function(){
      var filds, arrFilds;
      filds = document.querySelectorAll(`.add__description` + ', ' + '.add__value');
      arrFilds = Array.prototype.slice.call(filds);
      arrFilds.forEach(function (cur, ind, ar) {
        cur.value = '';
      });
      arrFilds[0].focus();
    },
    // display budget
    displayBudget : function(dat) {
      selector('.budget__value').textContent = dat.total.budget;
      selector('.budget__expenses--value').textContent = dat.total.exp;
      selector('.budget__income--value').textContent = dat.total.inc;
      if (dat.total.percent > 0) {
        selector('.budget__expenses--percentage').textContent = dat.total.percent + '%';
      } else {
        selector('.budget__expenses--percentage').textContent = '---';
      }
    }

  };

})();

/*!!! controller !!!*/
var controller = (function(budgetCtrl, UICtrl) {

  function events() {
    // event listeners
    selector('.add__btn').addEventListener('click', addValue);
    // on key press - enter
    document.addEventListener('keypress', function(event) {
      if (event.keyCode === 13) {
        addValue();
      }
    });
  }

  //save values
  var counter = 1;
  var addValue = function() {
    if (UICtrl.readUIvalues().description !== '' && UICtrl.readUIvalues().valueOfMoney !== '' && UICtrl.readUIvalues().valueOfMoney !== '0') {
      budgetCtrl.addItam(UICtrl.readUIvalues().typeOfValue, UICtrl.readUIvalues().description, parseFloat(UICtrl.readUIvalues().valueOfMoney));
      UICtrl.addString(budgetCtrl.retAllItams(), budgetCtrl.returnData());
      UICtrl.clearFilds();
      UICtrl.displayBudget(budgetCtrl.returnData());
    }
  };

  // let`s make light!
  return {
    returnEvents: function() {
      return events();
    }
  }

})(budgetController, UIController);

// start events
controller.returnEvents();
