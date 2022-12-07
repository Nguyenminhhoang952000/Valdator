function Validator(options) {

    // Hàm thực hiện validate
    function validate(sectionRule,checkrule){
        var Valuetest;
       //Lấy ra các rule của selector
        var lengthSelector=selecRule[checkrule.Selector];
        //Lặp qua từng rule và kiểm tra
        for(var i=0;i<lengthSelector.length;i++){
            // var checkradio= sectionRule;
            switch (sectionRule.type){
                //Xử lý input là checkbox or radio
                case 'radio':
                case 'checkbox': 
                    Valuetest=lengthSelector[i](
                        check.querySelector(checkrule.Selector+':checked')
                    )
                    break;
                default: Valuetest=lengthSelector[i](sectionRule.value);
            }
            if(Valuetest){
                break;
            }
        }
        // Valuetest=checkrule.test(sectionRule.value);
    
                if(Valuetest){
                    valiparent(sectionRule,options.formgroup).classList.add("invalid");
                    valiparent(sectionRule,options.formgroup).querySelector(options.errorSelector).innerText=Valuetest;
                }
                else{
                    valiparent(sectionRule,options.formgroup).classList.remove("invalid");
                    valiparent(sectionRule,options.formgroup).querySelector(options.errorSelector).innerText="";
                }
                return !Valuetest;
    }
    // Cách lấy thẻ cha
    function valiparent(element,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element=element.parentElement;
        } 
    }
    
    var check=document.querySelector(options.form);
    if(check){
            check.onsubmit=function(e){
                e.preventDefault();
                var isSubmit=true;
                options.rules.forEach(function(checkrule){
                    var sectionRule;
                    Array.from(check.querySelectorAll(checkrule.Selector)).forEach(function(element){
                        sectionRule=element;
                        var isValid=validate(sectionRule,checkrule);
                        if(!isValid){
                            isSubmit=false;
                        }
                        });     
                })
                if(isSubmit){                  
                    // var all={};
                    // options.rules.forEach(function(checkrule){
                    //     var sectionRule=check.querySelector(checkrule.Selector);
                    //     all[checkrule.Selector]=sectionRule.value;
                    // })
                    var enableInputs=Array.from(check.querySelectorAll('[name]'));
                    var formValues = enableInputs.reduce(function(total,values){                
                        switch (values.type){
                            // Xử lý lấy value cho input'radio - checkbox'
                            case 'radio':
                                total[values.name]=check.querySelector('input[name="'+values.name+'"]:checked').value;
                                break;
                            case 'checkbox':
                                if(values.matches(':checked')){
                                    if(!Array.isArray(total[values.name])){
                                        total[values.name]=[values.value];
                                    }
                                    else{
                                        total[values.name].push(values.value);
                                    }                             
                                }
                                // if(values.checked){
                                //     total[values.name]=values.value;
                                // }
                                break;
                            default: total[values.name]=values.value;
                        }           
                        return total;
                    },{})
                    options.submit(formValues); 
                }    
            } 
        
        var selecRule={};
        options.rules.forEach(function(checkrule){       
            if(Array.isArray(selecRule[checkrule.Selector])){
                selecRule[checkrule.Selector].push(checkrule.test);
            }
            else{
                selecRule[checkrule.Selector]=[checkrule.test];
            }
            var sectionRule;
            Array.from(check.querySelectorAll(checkrule.Selector)).forEach(function(element){
                sectionRule=element;
                //Bắt sự kiện onblur ra khỏi input
                sectionRule.onblur=function(){
                    validate(sectionRule,checkrule);
                }
                sectionRule.oninput=function(){
                    var valueinput=sectionRule.value; 
                    if(valueinput){
                        valiparent(sectionRule,options.formgroup).classList.remove("invalid");
                        valiparent(sectionRule,options.formgroup).querySelector(options.errorSelector).innerText="";
                    }
                }
            })
        })
    }
}
Validator.isRequired = function(Selector,message){
    return {
        Selector: Selector,
        test:function(value){
            return value ? undefined:message||'Vui lòng nhập lại trường này';
        }
    }
}
Validator.isEmail = function(Selector,message){
    return {
        Selector: Selector,
        test:function(value){
            var fillter=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
            return fillter.test(value)? undefined:message||'Trường này phải là Email';
        }
    }
}
Validator.minLength=function(Selector,min,message){
    return {
        Selector:Selector,
        test:function(value){
            return value.length>=min?undefined:message||`Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}
Validator.isPassconfi=function(Selector,checkvalue,message){
    return {
        Selector:Selector,
        test:function(values){
            var checkpassword=document.querySelector(checkvalue);
            return values===checkpassword.value?undefined:message||'Giá trị nhập vào không chính xác';
        }
    }
}