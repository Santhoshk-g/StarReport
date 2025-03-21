import { LightningElement, track, wire} from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Accounts from '@salesforce/schema/Account';
import keyaccount from '@salesforce/apex/StarReportController.KeyAccountlist';
import accountProgram from '@salesforce/schema/Account.Type';
import OpportunityStage from '@salesforce/schema/Opportunity.StageName';
import Opportunity from '@salesforce/schema/Opportunity';
import Opportunitysalesarea from '@salesforce/schema/Opportunity.Sales_Area__c';
import Region from '@salesforce/schema/Opportunity.Region__c';
import PROFILE_NAME_FIELD from '@salesforce/schema/User.Profile.Name';
import strUserId from '@salesforce/user/Id';
import {getRecord} from 'lightning/uiRecordApi';

export default class StarReport extends LightningElement {

    @track isfilter = false;
    @track closefilter = false;
    @track PicklistValues;
    pageSizeOptions = [5, 10, 25, 50, 75, 100]; //Page size options
    records = []; //All records available in the data table
    //columns = []; //columns information available in the data table
    @track total; //Total no.of records
    pageSize = 5; //No.of records to be displayed per page
    totalPages; //Total no.of pages
    pageNumber = 1; //Page number    
    recordsToDisplay = []; //Records to be displayed on the page
    displayrec = [];

    @wire(getRecord, {recordId: strUserId,fields: [PROFILE_NAME_FIELD]}) 
    wireuser({error,data }) {
        if (error) {
           this.error = error ; 
        } else if (data) {
            this.prfName =data.fields.Profile.value.fields.Name.value; 
            console.log(this.prfName);
            if(this.prfName === 'Inspire KAM User' || this.prfName === 'Infinity KAM User'){
                     this.kam = true;

            }else{
                this.Nonkam =true;
            }
            if(this.prfName == 'Inspire KAM User'){
                this.recordtype = 'Inspire';
              }
              if(this.prfName == 'Infinity KAM User'){
                this.recordtype = 'Infinity';
              }
        }
    }  
    @track isChecked = false;
    @track checkvalue = false;
    @track ModernHomes = false;
    @track LargeBuilder = false;
    @track OppBuilder = false;
    @track data =[];
    @track columns;
    @track error;
    @track recordtype;
    @track sales;
    loaded = false;
    @track  oppStage;
    @track arrayoppStage =[];
    @track grouped;
    @track accounttype;
    @track fromdate;
    @track todate;
    @track accprogram;
    @track oppregion;
    Inspire = false;
    Infinity = false;
    Gdata = false;
    @track PicklistValues;
    @track PicklistValues2;
    @track PicklistValues3;
    @track PicklistValues4;
    @wire (getObjectInfo,{objectApiName : Accounts})
    accountInfo;
    @wire (getObjectInfo,{objectApiName : Opportunity})
    opportunityInfo;

    get business(){
        return [
            {label: 'Infinity',value: 'Infinity'},
            {label: 'Inspire',value: 'Inspire'},
        ];
    }
    
    /*get getModern(){
        
        return [
            {label: 'Modern Homes', value: 'ModernHomes'},
            {label: 'Large Builder', value: 'LargeBuilder'},
            {label: 'Opportunity Builder', value: 'OpportunityBuilder'}
        ]
    }*/

    @wire(getPicklistValues,
        {
        recordTypeId : '$opportunityInfo.data.defaultRecordTypeId',
        fieldApiName : Region,
    }
    )
    
    regvalues(result) {
        //alert('region');
        if (result.data) {
           console.log('region values$$$$$$$$$$$$$$$$$$$$$$$$$'+ JSON.stringify(result.data));
            this.PicklistValues4 = [ { label: '--None--', value:null, selected: true }, ...result.data.values ];
        } else if (result.error) {
            alert('ERROR');
        }
    }
    
    GlassIcon2024(event){
       // alert('GlassIcon', event.target.value);
        this.checkvalue = true;

    }
    starmember(event){
        this.isChecked = event.target.checked;
    }
    
    ModernHomeshandler(event){
      this.ModernHomes = true;
      console.log('this.ModernHomes', this.ModernHomes)
    }

    LargeBuilderhandler(event){
      this.LargeBuilder = true;
      console.log('this.LargeBuilder', this.LargeBuilder)
    }
    
    OpportunityBuilder(event){
        this.OppBuilder = true;
        console.log('this.OppBuilder', this.OppBuilder)

    }
    @wire(getPicklistValues,
        {
        recordTypeId : '$opportunityInfo.data.defaultRecordTypeId',
        fieldApiName : Opportunitysalesarea,
    }
    )
    
    picvalues(result) {
        //alert()
        if (result.data) {
           // console.log(JSON.stringify(result.data));
            this.PicklistValues = [ { label: '--None--', value:null, selected: true }, ...result.data.values ];
        } else if (result.error) {
            alert('ERROR');
        }
    }
    @wire(getPicklistValues,
        {
        recordTypeId : '$accountInfo.data.defaultRecordTypeId',
        fieldApiName : accountProgram,
    }
    )
    
    accProgramvalues(result) {
        if (result.data) {
           // console.log(JSON.stringify(result.data));
            this.PicklistValues2 = [ { label: '--None--', value:null, selected: true }, ...result.data.values ];
        } else if (result.error) {
            alert('ERROR');
        }
    }

    
    @wire(getPicklistValues,
        {
        recordTypeId : '$opportunityInfo.data.defaultRecordTypeId',
        fieldApiName : OpportunityStage,
    }
    )
    stagevalues(result) {
        if (result.data) {
           console.log(JSON.stringify(result.data));
            this.PicklistValues3 = [ { label: '--None--', value:null, selected: true }, ...result.data.values ];
        } else if (result.error) {
            alert('ERROR');
        }
    }
        
    handlebusinessChange(event){
      this.recordtype = event.target.value;
      console.log('recordtype================'+ this.recordtype)
      
    }
    handlesalesareaChange(event){
        debugger
        this.sales = event.target.value;
        console.log('Sales Area===================='+ this.sales)
    }
    handleaccprogramChange(event){
     this.accprogram = event.target.value;
     console.log('Account program======================='+ this.accprogram)
    }
    handleregionChange(event){
        this.oppregion = event.target.value;
        console.log('Region======================='+ this.oppregion)
       }
    handleaccounttypeChange(event){
      this.accounttype = event.target.value;
      console.log('Account Type==========================='+ this.accounttype)
    }
    handlestage(event){
        this.oppStage = event.target.value;
        this.arrayoppStage = [...this.arrayoppStage, this.oppStage];
        console.log('Opportunity stage========================+'+ this.oppStage)
        console.log('Arrray Opportunity stage========================+'+ this.arrayoppStage)
    }
    
    
    
    fromDateChange(event){
        this.fromdate = event.target.value;
        console.log('From Date++++++++++++++++++++'+ this.fromdate)
    }
    toDateChange(event){
        this.todate = event.target.value;
        console.log('To Date+++++++++++++++++++++++'+ this.todate)
    }
    

    get options() {
        console.log('inside the options')
        return [
            { label: '--None--', value:null},
            { label: 'Strategic Account', value: 'Strategic Account'},
            { label: 'National Key Account', value: 'National Key Account'},
            { label: 'Build +', value: 'Build +'},
            { label: 'Udaan', value: 'Udaan'},
            { label: 'GrowARC', value: 'GrowARC'},
            { label: 'Platinum Customer', value: 'Platinum Customer'},
            { label: 'SGA Assured Processor', value: 'SGA Assured Processor'},
            { label: 'Kings Club', value: 'Kings Club'},
            { label: 'Inspirations', value: 'Inspirations'},
            { label: 'Modern Homes', value: 'Modern Homes'},
            { label: 'Udaan Processor', value: 'Udaan Processor'},
            { label: 'Inspire Strategic Account', value: 'Inspire Strategic Account'},
            { label: 'SG honors', value: 'SG honors'},
            { label: 'NKA/SKA Inspire', value: 'NKA/SKA Inspire'},
            { label: 'Star Architect', value: 'StartArchitecht'},
            { label: 'Star', value: 'Star'},
        ];
    }

    submit(){

        this.loaded = true;
        console.log('call the Apex Method')
        this.isfilter = false;

      /*  if(this.fromdate == null & this.todate == null){
            this.error = 'Please Select Required Field';
            this.loaded = false;


        }

        if((this.recordtype == 'Inspire' ||this.recordtype == 'Infinity') & this.fromdate == null & this.todate == null){

            this.error = 'Please Select Required Field';
            this.loaded = false;

        }*/

        if(this.recordtype == null){
            
            this.error = 'Please Select Required Field';
            this.loaded = false;
        }

        
            


        
        /*else if(this.accprogram == null & this.sales ==null & this.accounttype ==null & this.oppStage){
            this.error = 'Please select any One of these fields (Sales Area (or) Account Program (or) Account Type (or) Opportuninty Stage)';
            this.Gdata = false;
        }*/
        
        else if(this.fromdate == null & this.todate != null){
            this.error = 'Please fill the both dates';
            this.loaded = false;
            this.Gdata = false;
        }else if(this.fromdate != null & this.todate == null){
            this.error = 'Please fill the both dates';
            this.loaded = false;
            this.Gdata = false;
        }else if(this.fromdate != null & this.todate != null)
        {
        if(this.recordtype == 'Inspire'){


            this.Infinity = false;
            this.Inspire = true;
            
            //this.columns = columns;
        }else if(this.recordtype == 'Infinity'){
            this.Inspire = false;
            this.Infinity =true;
            //this.columns = columns1;
        }
        
        console.log('BeforeOpportunity stage========================+'+ this.oppStage)

        keyaccount({recordtype:this.recordtype,acctype:this.accounttype,sales:this.sales,accprogram:this.accprogram,fdate:this.fromdate,tdate:this.todate, oppStage:this.oppStage, oppregion: this.oppregion, GlassIcon:this.checkvalue, ModernHomes:this.ModernHomes, starmemberSGA:this.isChecked, LargeBuilder: this.LargeBuilder, OppBuilder:this.OppBuilder})
        .then(result=>{
           // console.log('data======>'+result);
            //this.data = result;
            this.loaded = false;
            const filteredList = result.filter((item, index) => {
                return index === result.findIndex(obj => {
                    return JSON.stringify(obj) === JSON.stringify(item);
                });
              });
              this.data = filteredList;
              this.total = filteredList.length; // update total records count
              //this.pageSize = 10;
              //this.records = filteredList; //set pageSize with default value as first option
              //this.paginationHelper(); // call helper menthod to update pagination logic 
              console.log('filteredList+++++++++++++###########'+JSON.stringify(filteredList) );
              
        
                if(this.data == null || this.data == ''){
                    this.error = 'No Records Found';
                    this.Gdata = false;
                }else{
                this.Gdata = true;
                this.error = undefined;
                }
                
                //return this.recordsToDisplay; 
    
    //console.log('ssssssss'+filtered);
            })
            
        .catch(error=>{
            alert(JSON.stringify(error))
            this.loaded = false;
            this.error = error; //.body.message;
        
        })
        }
        else{
            this.error = 'Please Select Required Field';
            this.loaded = false;
        }
        

    }

    get groupedData() {
        const grouped = this.data.reduce((acc, obj) => {
            const key = obj.ProjectName;
            if (!acc[key]) {
                acc[key] = {
                    ProjectName: key,   
                    oppdata: []
                 
                };
            }
            acc[key].oppdata.push(obj);
            return acc;
        }, {});
        this.loaded = false;
        console.log('Groupdata@@@@@@'+JSON.stringify(grouped));
        
        this.displayrec = Object.values(grouped);
        console.log('displayrec length=================='+ this.displayrec.length);
        this.totalRecords = this.displayrec.length;
        console.log('Update total record variable =================='+ this.totalRecords);
        
        //console.log('opportunity length=================='+ (this.displayrec.opportunityName).length);
        
        this.paginationHelper();
        return this.recordsToDisplay;
       
    }
    
    showtemplate(){
        console.log('showtemplate');
        this.isfilter = true;
        
    }
    hideModalBox(){
        console.log('hidemodalBox');
        this.isfilter = false;

    }

    value = 'inProgress';

    

    handleChange(event) {
        this.value = event.detail.value;
    }

    exportData(){
        // Prepare a html table
        console.log('ppapapap==='+this.recordtype)
        if(this.recordtype == 'Infinity'){
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
                   
        doc += '<th>'+ 'Account Name' +'</th>';
        doc += '<th>'+ 'City' +'</th>';
        doc += '<th>'+ 'LeadSourcedfrom' +'</th>';
        doc += '<th>'+ 'Project Code' +'</th>';
        doc += '<th>'+ 'opportunity Name' +'</th>';
        doc += '<th>'+ 'Segment' +'</th>';
        doc += '<th>'+ 'opportunity Stage' +'</th>';
        doc += '<th>'+ 'opportunity Region' +'</th>';
        doc += '<th>'+ 'Infinity SalesArea' +'</th>';
        doc += '<th>'+ 'Product' +'</th>';
        doc += '<th>'+ 'Estimated Quantity' +'</th>';
        doc += '<th>'+ 'Appropriated Quantity' +'</th>';
        doc += '<th>'+ 'ForecastDate' +'</th>';
        doc += '<th>'+ 'TotalEstimated Quantity' +'</th>';
        doc += '</tr>';
        // Add the data rows
        this.data.forEach(record => {
            
            doc += '<tr>';
            doc += '<th>'+record.AccountName+'</th>';
            doc += '<th>'+record.City+'</th>';
            doc += '<th>'+record.LeadSourcedfrom+'</th>';
            doc += '<th>'+record.ProjectCode+'</th>';
            doc += '<th>'+record.opportunityName+'</th>'; 
            doc += '<th>'+record.Segment+'</th>';
            doc += '<th>'+record.Stage+'</th>';
            doc += '<th>'+record.opportunityRegion+'</th>';
            doc += '<th>'+record.InfinitySalesArea+'</th>';
            doc += '<th>'+record.ProductName+'</th>';
            doc += '<th>'+record.TotalEstimatedQuantity+'</th>';
            doc += '<th>'+record.AppropriatedQuantity+'</th>';
            doc += '<th>'+record.ForecastDate+'</th>';
            doc += '<th>'+record.opptotalEstQty+'</th>';
            
            doc += '</tr>';
        });
        doc += '</table>';
    
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'AdequacyReport.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click(); 
    
      }else if(this.recordtype == 'Inspire'){
    
        let doc = '<table>';
        // Add styles for the table
        doc += '<style>';
        doc += 'table, th, td {';
        doc += '    border: 1px solid black;';
        doc += '    border-collapse: collapse;';
        doc += '}';          
        doc += '</style>';
        // Add all the Table Headers
        doc += '<tr>';
                   
            doc += '<th>'+ 'Account Name' +'</th>';
            doc += '<th>'+ 'City' +'</th>';
            doc += '<th>'+ 'LeadSourcedfrom' +'</th>';
            doc += '<th>'+ 'Project Code' +'</th>';
            doc += '<th>'+ 'opportunity Name' +'</th>';
            doc += '<th>'+ 'Segment' +'</th>';
            doc += '<th>'+ 'opportunity Stage' +'</th>';
            doc += '<th>'+ 'opportunity Region' +'</th>';
            doc += '<th>'+ 'Inspire SalesArea' +'</th>';
            doc += '<th>'+ 'Product' +'</th>';
            doc += '<th>'+ 'Estimated Quantity' +'</th>';
            doc += '<th>'+ 'Appropriated Quantity' +'</th>';
            doc += '<th>'+ 'ForecastDate' +'</th>';
            doc += '<th>'+ 'TotalEstimated Quantity' +'</th>';
        doc += '</tr>';
        // Add the data rows
        this.data.forEach(record => {
            
            doc += '<tr>';
            doc += '<th>'+record.AccountName+'</th>';
            doc += '<th>'+record.City+'</th>';
            doc += '<th>'+record.LeadSourcedfrom+'</th>';
            doc += '<th>'+record.ProjectCode+'</th>';
            doc += '<th>'+record.opportunityName+'</th>'; 
            doc += '<th>'+record.Segment+'</th>';
            doc += '<th>'+record.Stage+'</th>';
            doc += '<th>'+record.opportunityRegion+'</th>';
            doc += '<th>'+record.InspireSalesArea+'</th>';
            doc += '<th>'+record.ProductName+'</th>';
            doc += '<th>'+record.TotalEstimatedQuantity+'</th>';
            doc += '<th>'+record.AppropriatedQuantity+'</th>';
            doc += '<th>'+record.ForecastDate+'</th>';
            doc += '<th>'+record.opptotalEstQty+'</th>';
            
            doc += '</tr>';
        });
        doc += '</table>';
        var element = 'data:application/vnd.ms-excel,' + encodeURIComponent(doc);
        let downloadElement = document.createElement('a');
        downloadElement.href = element;
        downloadElement.target = '_self';
        // use .csv as extension on below line if you want to export data as csv
        downloadElement.download = 'Key Accounts.xls';
        document.body.appendChild(downloadElement);
        downloadElement.click(); 
        }
      }

      /*handleRecordsPerPage(event) {
        this.pageSize = event.target.value;
        this.paginationHelper();
    }*/
    previousPage() {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>previousPage');
        this.pageNumber = this.pageNumber - 1;
        this.paginationHelper();
    }
    nextPage() {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>nextPage');
        this.pageNumber = this.pageNumber + 1;
        this.paginationHelper();
    }
    firstPage() {
        this.pageNumber = 1;
        this.paginationHelper();
    }
    lastPage() {
        this.pageNumber = this.totalPages;
        this.paginationHelper();
    }
    // JS function to handel pagination logic 
    paginationHelper() {
        this.recordsToDisplay = [];
        console.log('recordsToDisplay+++++++++++++++++++++++++'+ this.recordsToDisplay);
        // calculate total pages
        console.log('calculate the total pages check the TOTAL Records'+ this.totalRecords);
        console.log('calculate the total pages check the PAGE SIZE'+ this.pageSize);
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        console.log('totalPages==========================='+ this.totalPages);
        // set page number 
        if (this.pageNumber <= 1) {
            this.pageNumber = 1;
        } else if (this.pageNumber >= this.totalPages) {
            this.pageNumber = this.totalPages;
        }
        // set records to display on current page 
        for (let i = (this.pageNumber - 1) * this.pageSize; i < this.pageNumber * this.pageSize; i++) {
            if (i === this.totalRecords) {
                break;
            }
            this.recordsToDisplay.push(this.displayrec[i]);
            console.log('length of record to display================================='+ this.recordsToDisplay.length);
            console.log('records to display=========================='+ JSON.stringify(this.recordsToDisplay));
        }
    }
}