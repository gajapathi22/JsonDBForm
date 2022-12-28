/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var schlDBName = 'SCHOOL-DB';
var schlRelationName = 'STUDENT-TABLE';
var connToken = '90938264|-31949273398893919|90952504';

$('#number').focus();

function saveRecNo2LS(jsonObj){
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem('recno',lvData.rec_no);
}
function getRollNumberAsJsonObj(){
    var number = $('#number').val();
    var jsonStr = {
        rollNumber : number
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $('#number').val(record.rollNumber);
    $('#name').val(record.name);
    $('#class').val(record.class);
    $('#birth-date').val(record.birthDate);
    $('#address').val(record.address);
    $('#enrollment-date').val(record.enrollDate);
}
function resetData(){
    $('#number').val('');
    $('#name').val('');
    $('#class').val('');
    $('#birth-date').val('');
    $('#address').val('');
    $('#enrollment-date').val('');
    $('#number').prop('disabled',false);
    $('#save').prop('disabled',true);
    $('#chnage').prop('disabled',true);
    $('#reset').prop('disabled',true); 
    $('#number').focus();
}

function saveData(){
    
    var jsonStrObj = validateData();
    if(jsonStrObj === ''){
        return '';
    }
    
    var putRequest = createPUTRequest(connToken,jsonStrObj,schlDBName,schlRelationName);
    jQuery.ajaxSetup({async: false});
    
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
  
    resetData();
    $('number').focus();
}
function changeData(){
    $('#change').prop('disabled',true);
    jsonChng = validateData();
    var updateRequest = createUPDATERecordRequest(connToken,jsonChng,schlDBName,schlRelationName,localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest,jpdbBaseURL,jpdbIML);   
    jQuery.ajaxSetup({async:true});
    resetData();
    $('number').focus();
}

function validateData(){
    
    var rollNumber,studName,studClass,studBD,studAdd,studED;
    rollNumber = $('#number').val();
    studName = $('#name').val();
    studClass = $('#class').val();
    studBD = $('#birth-date').val();
    studAdd = $('#address').val();
    studED = $('#enrollment-date').val();
    
    if(rollNumber === ''){
        alert('Roll Numer Missing');
        $('#number').focus();
        return '';
    }
     if(studName === ''){
        alert('Name is Missing');
        $('#name').focus();
        return '';
    }
     if(studClass === ''){
        alert('Class is Missing');
        $('#class').focus();
        return '';
    }
    if(studBD === ''){
        alert('Birth Date is Missing');
        $('#birth-date').focus();
        return '';
    }
     if(studAdd === ''){
        alert('Address Missing');
        $('#address').focus();
        return '';
    }
     if(studED === ''){
        alert('Enrollment Date is Missing');
        $('#enrollment-date').focus();
        return '';
    }
    
    var jsonStrObj = {
        rollNumber:rollNumber,
        name:studName,
        class:studClass,
        birthDate:studBD,
        address:studAdd,
        enrollDate:studED
    };
    
    console.log(jsonStrObj);
    
    return JSON.stringify(jsonStrObj);
}

function getStudent(){
    console.log('hi');
    var studRollNumberObj = getRollNumberAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken,schlDBName,schlRelationName,studRollNumberObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);   
    jQuery.ajaxSetup({async:true});
    if (resJsonObj.status === 400){
        console.log('400')
        $('#save').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#name').focus();
    }else if (resJsonObj.status === 200){
        console.log('200')
        $('#number').prop('disabled',true);
        fillData(resJsonObj);
        $('#save').prop('disabled',true);
        $('#change').prop('disabled',false);
        $('#reset').prop('disabled',false);
        $('#name').focus();
        
    }
}


