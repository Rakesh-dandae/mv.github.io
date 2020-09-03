var sGpwaTEversion="0.0.18";
/*
0.0.18 -------------------------------------------------------------------------------------------------------------------------------
   OK function doSwitchView(sInCommand): Update!
0.0.19 -------------------------------------------------------------------------------------------------------------------------------
OK function doPostMessageToConf(oInJSON): New!
o- function doShowTableEditMode(): New!
      Tab selection handling.
      -- Editmode table setting
      -- Show/edit name,Requirements,Services,Componens,precondition,and other attributes columns.
0.0.20 -------------------------------------------------------------------------------------------------------------------------------
   .- function syncStations(): New!
      Synchronize link data!
   -- function doUpdateSolutionObjectList(xConf): Update!
      Show links below stations/configurations
      export import + sample?
      tab creation
   .- function doShowNetwork(): Update!
      Support for API-UI.
   -- sync links using path id and link id...
   -- doShowClassificationTree

*/
var oGCableRule={};
var bGCableRuleCreationMode=false;
var bGShowNetworkView=false;
var bGUseNewEngine=false;
var oGActiveModel={ objects: [] };
var oGActiveSolution={};//Contains the active solution object
var oGSolutions=[];
var oWebWorkers = {};
var nGSC=1;
var sGSelectedConfigurationID="S"+("1234567891"+((new Date()).getTime()).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(nGSC++).toString()).substr(-11,11);
var _VALIDATOR="";
var nGShowIdTxt=0;
//For 3D
var lGCables={};
var sGAssetVisited="";
var sGSVGCables="";
var nGViewMode=0;
var nWWindex=1;

var lGObjectsById={};
var lGObjectsByReqId={};
var lGObjectsBySerId={};

var bGEditMode=false;
var nGPathId=0;
var bGTableEditMode=false;

//26.4.2018-->
var aGAttrList=[];
var nGTmpIndex=0;
var sSGVvisited="";
var nGActiveSheet=1;
//Workaround!!!
var nGActiveTable=0;
var oGProject={
   stations:[],
   opaths:{},
   links:[]
};
var nGTabIndex=1;
var nGNextLinkId=1;
var aGLinks=[];
var oGLink={
   id:"",
   name:"",
   from:"",//Configuration id
   from_name:"",
   to:"",//Configuration id
   to_name:"",
   selections:[]
};
var oGStation={
   id:doGetNextStationId(),
   name:"Station",
   selections:[]
};
//3D -->
var nGxorigo=200; //Asetetaan kuution origo paikalleen koordinaatistossa!
var nGyorigo=400;
var nGzorigo=0;
var nGxkierto=0; //Kierto kulmat.
var nGykierto=0;
var nGzkierto=0;
var fGsize=1.0;
var nGLayers=2;
var fGycKerroin=0.0;
var fGysKerroin=0.0;
var fGxcKerroin=0.0;
var fGxsKerroin=0.0;
var fGzcKerroin=0.0;
var fGzsKerroin=0.0;
var bGShowCables=false;
var bGShowImages=false;
var nGYshift=1867;
var sGCurrentObjectID="";

var nGAssetFileIndex=0;
var nGAssetFileIndexNeeded=0;
var sGCMN="";
var bGTestMode=false;
var sGRole="Normal user";
//<--
//CAT simulation --->
var sGVersion = "1.2.5";
var sGDate = "08.01.2018";
var oGCAT = new CAT({
		"-VERSION": sGVersion,
		"-DESCR": "Phase 2",
		"-DATE": sGDate,
		"Scenarios": {
			"SCENARIO": [new Scenario({
					"-NR": "1",
					"-DESCR": "Configurations to CSP"
				})]
		}
	});
//<------
var oGCompareToSolution={};
var bGCompare=false;
var aGCompareToList=[];
var oGTemplates={};
var sGLinkFromID="";
var sGLinkToID="";
var sGLinkFromName="";
var sGLinkToName="";
var sGStoreSIHTML = "";
var oGLoadedTemplates=[];
var aGPreviousSolutions=[];
var lGModelObjectsByName=[];

//Report object
function Report() {
   this.name="Report";
};
//AssetFile Constructor test
function AssetFile() {
      this.fileName = "Test.xml";
      this.reports=[new Report()];
      this.getAsJSONObject = function () {
         var oJSON = JSON.parse({});
         return (oJSON);
      };
      this.getAsXmlWorkbook = function () {
         var sHTML = "",i=0;
         sHTML += '<?xml version="1.0"?>';
         sHTML += '<?mso-application progid="Excel.Sheet"?>';
         sHTML += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
         sHTML += '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">';
         sHTML += '<Author>TE</Author>';
         sHTML += '<LastAuthor>TE</LastAuthor>';
         sHTML += '<Created>2019-08-07T06:52:39Z</Created>';
         sHTML += '<Version>16.00</Version>';
         sHTML += '</DocumentProperties>';
         sHTML += '<OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office">';
         sHTML += '<AllowPNG/>';
         sHTML += '</OfficeDocumentSettings>';
         sHTML += '<ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">';
         sHTML += '<WindowHeight>7695</WindowHeight>';
         sHTML += '<WindowWidth>20490</WindowWidth>';
         sHTML += '<WindowTopX>32767</WindowTopX>';
         sHTML += '<WindowTopY>32767</WindowTopY>';
         sHTML += '<ProtectStructure>False</ProtectStructure>';
         sHTML += '<ProtectWindows>False</ProtectWindows>';
         sHTML += '</ExcelWorkbook>';
         sHTML += '<Styles>';
         sHTML += '<Style ss:ID="Default" ss:Name="Normal">';
         sHTML += '<Alignment ss:Vertical="Bottom"/>';
         sHTML += '<Borders/>';
         sHTML += '<Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>';
         sHTML += '<Interior/>';
         sHTML += '<NumberFormat/>';
         sHTML += '<Protection/>';
         sHTML += '</Style>';
         sHTML += '</Styles>';
         do {
            sHTML += '<Worksheet ss:Name="Sheet'+(i+1)+'">';
            sHTML += '<Table ss:ExpandedColumnCount="1" ss:ExpandedRowCount="1" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="15">';
            sHTML += '<Row>';
            sHTML += '<Cell><Data ss:Type="String">Test</Data></Cell>';
            sHTML += '</Row>';
            sHTML += '</Table>';
            sHTML += '<WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">';
            sHTML += '<PageSetup>';
            sHTML += '<Header x:Margin="0.3"/>';
            sHTML += '<Footer x:Margin="0.3"/>';
            sHTML += '<PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/>';
            sHTML += '</PageSetup>';
            sHTML += '<Selected/>';
            sHTML += '<Panes>';
            sHTML += '<Pane>';
            sHTML += '<Number>3</Number>';
            sHTML += '<ActiveRow>1</ActiveRow>';
            sHTML += '</Pane>';
            sHTML += '</Panes>';
            sHTML += '<ProtectObjects>False</ProtectObjects>';
            sHTML += '<ProtectScenarios>False</ProtectScenarios>';
            sHTML += '</WorksheetOptions>';
            sHTML += '</Worksheet>';
         } while((++i)<this.reports.length);
         sHTML += '</Workbook>';
         return (sHTML);
      };

}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doPostMessageToConf(oInJSON) {
   var xConf = getConfigByID(sGSelectedConfigurationID);
   if(xConf != null) {
      try {
         if(typeof(Worker) !== "undefined") {
            if(sGSelectedConfigurationID != "") {
               if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined') {
                  xConf.data.messageobject = JSON.parse(JSON.stringify(oInJSON));
                  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
                  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
               }
            }
         }
      } catch(e) {
         document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration or message?</span>";
      }
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doEditModelComponent(sInObjectName) {
   if(bGTableEditMode){
      doShowTableEditMode(sInObjectName);
   } else {
      var oInObject=doGetModelObjectById(sInObjectName);
      var nLevel=0,sHTML="",sIMG="";
      oGSelectedItem=oInObject;
      aGAttrList.splice(0,aGAttrList.length);
      sHTML+="<div style=\"position: relative;\" class=\"panel panel-primary\">";
      sHTML+= "<div id=\"hdngcmpnnt\" class=\"panel-heading\">";
      sHTML+=  "<span>Component</span><a href='#' title=\"Add object to Solution\" onclick=\"addObject2SolutionByName('"+(oInObject.name)+"',1,'');\">+</a>";
      sHTML+=  "<span style=\"float: right;\">";
      sHTML+=  "<i title=\"Copy\" class=\"fa fa-clone\" onclick=\"doCopyModelObjectByName('"+(oInObject.name)+"');doEditModelComponent('"+sInObjectName+"');\" style=\"font-size:24px\"></i>";
      sHTML+=  "<i title=\"Inherit from this\" class=\"fa fa-clone\" onclick=\"doInheritModelObjectByName('"+(oInObject.name)+"');doEditModelComponent('"+sInObjectName+"');\" style=\"font-size:24px\"></i>";
      sHTML+=  "<span>&nbsp;</span>";
      sHTML+=  "<span>&nbsp;</span>";
      if(((oInObject.id)&&(typeof oGActiveSolution.objects !== 'undefined'))||bGUseNewEngine) sHTML+=  "<i title=\"Add object to Solution\" class=\"fa fa-gears\" onclick=\"addObject2SolutionByName('"+(oInObject.name)+"',1,'');\" style=\"font-size:24px\"></i>";
      sHTML+=  "<span>&nbsp;</span>";
      sHTML+=  "<span>&nbsp;</span>";
      if((oInObject.id)&&(!oInObject.components)) sHTML+="<i title=\"Create a new template\" class=\"fa fa-tag\" onclick=\"doCreateTemplate('"+(oInObject.id)+"','"+(oInObject.name)+"');\" style=\"font-size:24px\"></i>";
      sHTML+=  "<span>&nbsp;</span>";
      sHTML+=  "<span>&nbsp;</span>";
      if(oInObject.id) {
         sHTML+=  "<i title=\"Remove object from Solution\" class=\"fa fa-trash-o\" onclick=\"removeObjectFromSolutionById('"+(oInObject.id)+"');\" style=\"font-size:24px\"></i>";
      } else {
         sHTML+=  "<i title=\"Remove object from Model\" class=\"fa fa-trash-o\" onclick=\"removeObjectFromModelByName('"+(oInObject.name)+"');\" style=\"font-size:24px\"></i>";
      }
      sHTML+=  "</span>";
      sHTML+=  "<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\" style=\"position: absolute; top:4px; right: 2px;\" onClick=\"document.getElementById('content').innerHTML='';\"></span>";
      sHTML+= "</div>";
      sHTML+= "<div class=\"panel-body\"><div id=\"L"+(oInObject.id||"NA")+"\">";
      aGAttrList.push(oInObject);
      for(var key in oInObject) {
         if((key.toUpperCase()=="IMAGE")&&(oInObject[key].url.indexOf(".png")>0)) {
            sIMG+="<div style=\"position: relative;\">";
            sIMG+= "<img alt='Image not found? ["+oInObject[key].url+"]' draggable=\"false\" src=\""+oInObject[key].url+"\" style=\"width:100%;border:0;\" onclick=\"$('#showCoordinatesid').html('[x:'+parseInt(event.pageX-$(this).offset().left)+',y:'+parseInt(event.pageY-$(this).offset().top)+']');\"/>";
            sIMG+= "<span id=\"showCoordinatesid\" style=\"position: absolute; left: 0; top: 50%; width: 100%; text-align: center; font-size: 18px; color:red;\"></span>";
            sIMG+="</div>";
         }
         sHTML+=sGetAttributeHTML(key,oInObject[key],nLevel);
      }//for(var key in oInObject)
      if(sIMG!="")sHTML+=sIMG;
      sHTML+= "</div>";
      var sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
      sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
      sHTML+="<div class=\"row\">";
      sHTML+= "<div class=\"col-sm-3\">";
      sHTML+=  "<i title=\"Add new attribute\" class=\"fa fa-plus\" onClick=\"document.getElementById('"+sNewAttr+"').setAttribute('style','visibility: visible;border-left: 6px solid blue;');\" style=\"font-size:24px\"></i>";
      sHTML+=  "<i title=\"Add new Service\" class=\"fa fa-tags\" style=\"font-size:24px;color:green\" onClick=\"(aGAttrList["+nLevel+"].services ? aGAttrList["+nLevel+"].services.push({'service':'new service'}):aGAttrList["+nLevel+"].services=[{'service':'new service'}]);doEditModelComponent('"+sInObjectName+"');\" style=\"font-size:24px\"></i>";
      sHTML+=  "<i title=\"Add new Requirement\" class=\"fa fa-tags\" style=\"font-size:24px;color:red\" onClick=\"(aGAttrList["+nLevel+"].requirements ? aGAttrList["+nLevel+"].requirements.push({'requirement':'new requirement'}):aGAttrList["+nLevel+"].requirements=[{'requirement':'new requirement'}]);doEditModelComponent('"+sInObjectName+"');\" style=\"font-size:24px\"></i>";
      if(!oInObject.location) sHTML+=  "<span title=\"Add new location\" style=\"font-size:24px;color:lightblue\" onClick=\"aGAttrList["+nLevel+"].location={'x':0,'y':0,'z':0,'unit':'mm'};doEditModelComponent('"+sInObjectName+"');\" class=\"glyphicon glyphicon-map-marker\"></span>";
      if(!oInObject.dimensions) {
         sHTML+=  "<i title=\"Add dimensions\" style=\"font-size:24px;color:lightgreen\" class=\"fa fa-cube\" onClick=\"aGAttrList["+nLevel+"].dimensions={'width':0,'height':0,'depth':0,'unit':'mm'};doEditModelComponent('"+sInObjectName+"');\"></i>";
      } else {
         doShowModelObjectIn3D(oInObject.name);
      }
      sHTML+= "</div>";
      sHTML+= "<div class=\"col-sm-9\">";
      sHTML+=  "<input id=\""+sNewAttr+"\" style=\"visibility:hidden;border-left: 6px solid blue;\" class=\"form-control\" type=\"text\" onblur=\"aGAttrList["+nLevel+"][this.value]='value';$('#L"+(oInObject.id||"NA")+"').append(sGetAttributeHTML(this.value,'',"+nLevel+"));\"/>";
      sHTML+= "</div>";
      sHTML+="</div>";
      sHTML+="<div class=\"row\">";
      sHTML+= "<div class=\"col-sm-12\">";
      sHTML+=  "<button onclick='doSetObject(\""+sInObjectName+"\",\"sObjectTxt\");'>Save</button><span id='sObjectTxterror'></span><textarea class=\"form-control\" rows=\"48\" id=\"sObjectTxt\">"+JSON.stringify(oInObject)+"</textarea>";
      sHTML+= "</div>";
      sHTML+="</div>";
      sHTML+= "</div>";
      sHTML+="</div>";
      //if(bGEditMode){
      //   var sKeepHTML=document.getElementById("showcontent").innerHTML;
      //   document.getElementById("content").innerHTML=sKeepHTML+sHTML;
      //} else {
         document.getElementById("content").innerHTML=sHTML;
      //}
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doShowTableEditMode(sInObjectName){
   var sHTMLTable="",sTabs="",nTabs=0,sActiveSheetName="";
   bGTableEditMode=true;
   if((sInObjectName||"")!=""){
      sHTMLTable+="<div class='container'>";
      sHTMLTable+="<div class='table-responsible'>";
      sHTMLTable+= "<table class='table table-condensed table-bordered table-hover' style='width:100%'>";
      sHTMLTable+=  "<thead>";
      sHTMLTable+=   "<th>#</th>";
      sHTMLTable+=   "<th>Name</th>";
      sHTMLTable+=   "<th class='danger' style='width:20%'>Requirements</th>";
      sHTMLTable+=   "<th class='danger'>Capacity</th>";
      sHTMLTable+=   "<th class='success'>Services</th>";
      sHTMLTable+=   "<th class='success'>Capacity</th>";
      sHTMLTable+=   "<th class='info'>Component</th>";
      sHTMLTable+=   "<th class='info'>Qty</th>";
      sHTMLTable+=  "</thead>";
      sHTMLTable+=  "<tbody>";
      for(var x in oGActiveModel.objects){
         if(sInObjectName==(oGActiveModel.objects[x].name||"Object name not found?")){
            sHTMLTable+=   "<tr>";
            sHTMLTable+=    "<td onclick='bGTableEditMode=false;doEditModelComponent(\""+sInObjectName+"\");'>";
            sHTMLTable+=      (parseInt(x)+1);
            sHTMLTable+=    "</td>";
            sHTMLTable+=    "<td>";
            sHTMLTable+=      oGActiveModel.objects[x].name||"?";
            sHTMLTable+=    "</td>";
            if((oGActiveModel.objects[x].requirements||[]).length>0){
               sHTMLTable+=    "<td class='danger' style='width:20%'>";
               sHTMLTable+=      (oGActiveModel.objects[x].requirements[0].requirement||"?").toString().replace(/\,/g,", ");
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='danger'>";
               sHTMLTable+=      JSON.stringify(oGActiveModel.objects[x].requirements[0].capacity||1);
               sHTMLTable+=    "</td>";
            } else {
               sHTMLTable+=    "<td class='danger' style='width:20%'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='danger'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
            }
            if((oGActiveModel.objects[x].services||[]).length>0){
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      oGActiveModel.objects[x].services[0].service||"?";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      oGActiveModel.objects[x].services[0].capacity||1;
               sHTMLTable+=    "</td>";
            } else {
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
            }
            if((oGActiveModel.objects[x].components||[]).length>0){
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      oGActiveModel.objects[x].components[0].name||"?";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      oGActiveModel.objects[x].components[0].qty||1;
               sHTMLTable+=    "</td>";
            } else {
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
            }
            sHTMLTable+=   "</tr>";
            var nMax=(oGActiveModel.objects[x].requirements||[]).length;
            if((oGActiveModel.objects[x].services||[]).length>nMax) nMax=(oGActiveModel.objects[x].services||[]).length;
            if((oGActiveModel.objects[x].components||[]).length>nMax) nMax=(oGActiveModel.objects[x].components||[]).length;
            for(var ni=1;ni<nMax;ni++){
               sHTMLTable+=   "<tr>";
               sHTMLTable+=    "<td>";
               sHTMLTable+=      "&nbsp";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               if((oGActiveModel.objects[x].requirements||[]).length>ni){
                  sHTMLTable+=    "<td class='danger' style='width:20%'>";
                  sHTMLTable+=      (oGActiveModel.objects[x].requirements[ni].requirement||"?").toString().replace(/\,/g,", ");
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='danger'>";
                  sHTMLTable+=      JSON.stringify(oGActiveModel.objects[x].requirements[ni].capacity||1);
                  sHTMLTable+=    "</td>";
               } else {
                  sHTMLTable+=    "<td class='danger' style='width:20%'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='danger'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
               }
               if((oGActiveModel.objects[x].services||[]).length>ni){
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      oGActiveModel.objects[x].services[ni].service||"?";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      oGActiveModel.objects[x].services[ni].capacity||1;
                  sHTMLTable+=    "</td>";
               } else {
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
               }
               if((oGActiveModel.objects[x].components||[]).length>ni){
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      oGActiveModel.objects[x].components[ni].name||"?";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      oGActiveModel.objects[x].components[ni].qty||1;
                  sHTMLTable+=    "</td>";
               } else {
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
               }
               sHTMLTable+=   "</tr>";
            }
         }
      }
      sHTMLTable+=  "</tbody>";
      sHTMLTable+= "</table>";
      sHTMLTable+="</div>";
      sHTMLTable+="</div>";
      $("#content").html(sHTMLTable);
   } else {
      sHTMLTable+="<ul class='nav nav-tabs'>";
      for(var x in oGActiveModel.objects){
         var sCurrTab="Main";
         if(typeof oGActiveModel.objects[x].sheet_name!=='undefined'){
            sCurrTab=oGActiveModel.objects[x].sheet_name||"Main";
         }
         if(sTabs.indexOf("["+sCurrTab+"]")<0){
            sTabs+="["+sCurrTab+"]";
            nTabs++;
            if(nTabs==8){
               sHTMLTable+="<li class='dropdown'>";
               sHTMLTable+="<a class='dropdown-toggle' data-toggle='dropdown' href='#'>More<span class='caret'></span></a>";
               sHTMLTable+="<ul class='dropdown-menu'>";
            }
            sHTMLTable+="<li "+(nGActiveSheet==nTabs ? "class='active'":"")+"><a href='#' onclick='nGActiveSheet="+nTabs+";doShowTableEditMode();'>"+sCurrTab+"</a></li>";//Class=active?
            if(nGActiveSheet==nTabs) sActiveSheetName=sCurrTab;
         }
      }
      if(nTabs>7) sHTMLTable+="</ul></li>";
      sHTMLTable+="</ul>";
      sHTMLTable+="<p>&nbsp;</p><div class='container'>";
      sHTMLTable+="<div class='table-responsible'>";
      sHTMLTable+= "<table class='table table-condensed table-bordered table-hover' style='width:100%'>";
      sHTMLTable+=  "<thead>";
      sHTMLTable+=   "<th>#</th>";
      sHTMLTable+=   "<th>Name</th>";
      sHTMLTable+=   "<th class='danger' style='width:20%'>Requirements</th>";
      sHTMLTable+=   "<th class='danger'>Capacity</th>";
      sHTMLTable+=   "<th class='success'>Services</th>";
      sHTMLTable+=   "<th class='success'>Capacity</th>";
      sHTMLTable+=   "<th class='info'>Component</th>";
      sHTMLTable+=   "<th class='info'>Qty</th>";
      sHTMLTable+=  "</thead>";
      sHTMLTable+=  "<tbody>";
      for(var x in oGActiveModel.objects){
         if(sActiveSheetName==(oGActiveModel.objects[x].sheet_name||"Main")){
            sHTMLTable+=   "<tr>";
            sHTMLTable+=    "<td onclick='bGTableEditMode=false;doEditModelComponent(\""+(oGActiveModel.objects[x].name||"")+"\");'>";
            sHTMLTable+=      (parseInt(x)+1);
            sHTMLTable+=    "</td>";
            sHTMLTable+=    "<td>";
            sHTMLTable+=      oGActiveModel.objects[x].name||"?";
            sHTMLTable+=    "</td>";
            if((oGActiveModel.objects[x].requirements||[]).length>0){
               sHTMLTable+=    "<td class='danger' style='width:20%'>";
               sHTMLTable+=      (oGActiveModel.objects[x].requirements[0].requirement||"?").toString().replace(/\,/g,", ");
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='danger'>";
               sHTMLTable+=      JSON.stringify(oGActiveModel.objects[x].requirements[0].capacity||1);
               sHTMLTable+=    "</td>";
            } else {
               sHTMLTable+=    "<td class='danger' style='width:20%'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='danger'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
            }
            if((oGActiveModel.objects[x].services||[]).length>0){
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      oGActiveModel.objects[x].services[0].service||"?";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      oGActiveModel.objects[x].services[0].capacity||1;
               sHTMLTable+=    "</td>";
            } else {
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='success'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
            }
            if((oGActiveModel.objects[x].components||[]).length>0){
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      oGActiveModel.objects[x].components[0].name||"?";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      oGActiveModel.objects[x].components[0].qty||1;
               sHTMLTable+=    "</td>";
            } else {
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td class='info'>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
            }
            sHTMLTable+=   "</tr>";
            var nMax=(oGActiveModel.objects[x].requirements||[]).length;
            if((oGActiveModel.objects[x].services||[]).length>nMax) nMax=(oGActiveModel.objects[x].services||[]).length;
            if((oGActiveModel.objects[x].components||[]).length>nMax) nMax=(oGActiveModel.objects[x].components||[]).length;
            for(var ni=1;ni<nMax;ni++){
               sHTMLTable+=   "<tr>";
               sHTMLTable+=    "<td>";
               sHTMLTable+=      "&nbsp";
               sHTMLTable+=    "</td>";
               sHTMLTable+=    "<td>";
               sHTMLTable+=      "&nbsp;";
               sHTMLTable+=    "</td>";
               if((oGActiveModel.objects[x].requirements||[]).length>ni){
                  sHTMLTable+=    "<td class='danger' style='width:20%'>";
                  sHTMLTable+=      (oGActiveModel.objects[x].requirements[ni].requirement||"?").toString().replace(/\,/g,", ");
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='danger'>";
                  sHTMLTable+=      JSON.stringify(oGActiveModel.objects[x].requirements[ni].capacity||1);
                  sHTMLTable+=    "</td>";
               } else {
                  sHTMLTable+=    "<td class='danger' style='width:20%'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='danger'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
               }
               if((oGActiveModel.objects[x].services||[]).length>ni){
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      oGActiveModel.objects[x].services[ni].service||"?";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      oGActiveModel.objects[x].services[ni].capacity||1;
                  sHTMLTable+=    "</td>";
               } else {
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='success'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
               }
               if((oGActiveModel.objects[x].components||[]).length>ni){
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      oGActiveModel.objects[x].components[ni].name||"?";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      oGActiveModel.objects[x].components[ni].qty||1;
                  sHTMLTable+=    "</td>";
               } else {
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
                  sHTMLTable+=    "<td class='info'>";
                  sHTMLTable+=      "&nbsp;";
                  sHTMLTable+=    "</td>";
               }
               sHTMLTable+=   "</tr>";
            }
         }
      }
      sHTMLTable+=  "</tbody>";
      sHTMLTable+= "</table>";
      sHTMLTable+="</div>";
      sHTMLTable+="</div>";
      $("#content").html(sHTMLTable);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doSwitchView(sInCommand) {
   if((sInCommand||"")=="L"){
      switch(nGViewMode) {
         case 0: nGViewMode=1; break;
         case 1: nGViewMode=0; break;
         case 2: nGViewMode=3; break;
         case 3: nGViewMode=2; break;
      }
    } else if((sInCommand||"")=="R"){
      switch(nGViewMode) {
         case 0: nGViewMode=2; break;
         case 1: nGViewMode=3; break;
         case 2: nGViewMode=0; break;
         case 3: nGViewMode=1; break;
      }
   } else {
      nGViewMode++;
      if(nGViewMode>3) {
         nGViewMode=0;
         if(document.getElementById("mintframe")!=null) document.getElementById("content").innerHTML=sInitMessage;
      }
   }
   switch(nGViewMode) {
      case 0:
         $("#tablecol1").attr("class","col-xs-3");
         $("#tablecol2").attr("class","col-xs-6");
         $("#tablecol3").attr("class","col-xs-3");
         $("#tablecol1").show(1000);
         $("#tablecol2").show(1000);
         $("#tablecol3").show(1000);
         $("#widthcontrolL").attr("class","glyphicon glyphicon-chevron-left");
         $("#widthcontrolR").attr("class","glyphicon glyphicon-chevron-right");
         break;
      case 1:
         $("#tablecol1").attr("class","");
         $("#tablecol2").attr("class","col-xs-9");
         $("#tablecol3").attr("class","col-xs-3");
         $("#tablecol1").hide();
         $("#tablecol2").show(1000);
         $("#tablecol3").show(1000);
         $("#widthcontrolL").attr("class","glyphicon glyphicon-chevron-right");
         $("#widthcontrolR").attr("class","glyphicon glyphicon-chevron-right");
         break;
      case 2:
         $("#tablecol1").attr("class","col-xs-3");
         $("#tablecol2").attr("class","col-xs-9");
         $("#tablecol3").attr("class","");
         $("#tablecol3").hide();
         $("#tablecol1").show(1000);
         $("#tablecol2").show(1000);
         $("#widthcontrolL").attr("class","glyphicon glyphicon-chevron-left");
         $("#widthcontrolR").attr("class","glyphicon glyphicon-chevron-left");
         break;
      case 3:
         $("#tablecol1").attr("class","");
         $("#tablecol2").attr("class","col-xs-12");
         $("#tablecol3").attr("class","");
         $("#tablecol1").hide();
         $("#tablecol2").show(1000);
         $("#tablecol3").hide();
         $("#widthcontrolL").attr("class","glyphicon glyphicon-chevron-right");
         $("#widthcontrolR").attr("class","glyphicon glyphicon-chevron-left");
         break;
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doInheritModelObjectByName(sInObjectName) {
   var oCopyObject=JSON.parse(JSON.stringify(doGetModelObjectById(sInObjectName)));
   oCopyObject.name="Inherited object of "+oCopyObject.name;
   oCopyObject.extends=[];
   oCopyObject.extends.push(sInObjectName);
   oGActiveModel.objects.push(oCopyObject);
   doUpdateModelObjectList();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doShowClassificationTree(){
  if($("#myModelObjectListFilter").val()=="#t"){
      $("#myModelObjectListFilter").val("");
      $("#classificationid").attr("class","glyphicon glyphicon-folder-open");
      $("#classificationid").attr("title","Show objects in classification tree!");
      doUpdateModelObjectList();
   } else {
      $("#myModelObjectListFilter").val("#t");
      $("#classificationid").attr("class","glyphicon glyphicon-folder-close");
      $("#classificationid").attr("title","Show all objects!");
      //Find all classes:
      var sClasses="",aClasses=[],oCurrentClass={};
      for(var x in oGActiveModel.objects) {
         if(typeof oGActiveModel.objects[x].extends!=='undefined') {
            for(var y in oGActiveModel.objects[x].extends) {
               if(sClasses.indexOf("["+oGActiveModel.objects[x].extends[y]+"]")<0) {
                  sClasses+="["+oGActiveModel.objects[x].extends[y]+"]";
                  oCurrentClass={name:oGActiveModel.objects[x].extends[y],objects:[]}
                  oCurrentClass.objects.push(oGActiveModel.objects[x].name);
                  aClasses.push(oCurrentClass);
               } else {
                  for(var z in aClasses){
                     if(aClasses[z].name==oGActiveModel.objects[x].extends[y]){
                        aClasses[z].objects.push(oGActiveModel.objects[x].name);
                     }
                  }
               }
            }
         }
      }
      var sCHTML="",nIndex=0;
      for(var z in aClasses) {
         sCHTML+='<a title="Click to expand or collapse." data-toggle="collapse" href="#tmpcl'+(++nIndex)+'" class="list-group-item list-group-item-info">'+aClasses[z].name+'</a><div id="tmpcl'+(nIndex)+'" class="panel-collapse collapse"><ol>';
         for(var x in aClasses[z].objects) {
            sCHTML+="<li><a href='#' onclick='doEditModelComponent(\""+aClasses[z].objects[x]+"\")'>"+aClasses[z].objects[x]+"</a></li>";
         }
         sCHTML+='</ol></div>';
      }
      $("#myModelObjectList").html(sCHTML);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function syncStations(){
   var lLocation={},lUpdateStations=[],lAddStations=[],sAddedNames="",oCurrLink={},oCurrStation={},sFromStationName="",bNewStations=false;
   var aLinks=oGSolutions.filter(function (mysolution){
      return mysolution.objects;
   });
   var test="";
   /*
   for(var x in oGSolutions){
      for(var jii in oGSolutions[x].objects){
         for(var ji in oGSolutions[x].objects[jii].requirements){
            if(oGSolutions[x].objects[jii].requirements[ji].requirement=="From Station") {
               sFromStationName=(oGSolutions[x].name||"Station");
               lLocation=(oGSolutions[x].objects[jii].location||{x:0,y:0,z:0});
            }
            if(oGSolutions[x].objects[jii].requirements[ji].requirement=="To Station") {
               if(typeof oGSolutions[x].objects[jii].requirements[ji].value!=='undefined'){
                  var sCheckStationName=oGSolutions[x].objects[jii].requirements[ji].value;
                  if(sCheckStationName!=""){
                     var bLoytyko=false;
                     for(var y in oGSolutions){
                        if(oGSolutions[y].name==sCheckStationName){
                           bLoytyko=true;
                           for(var z in lAddStations){
                              if(lAddStations[z].name==sCheckStationName){
                                 bLoytyko=false;
                              }
                           }
                           break;
                        }
                     }
                     if(!bLoytyko){
                        var lselections=[],nLinkId=1;
                        if((typeof oGProject.opaths[sFromStationName+"_"+sCheckStationName]==='undefined')&&(typeof oGProject.opaths[sCheckStationName+"_"+sFromStationName]==='undefined')){
                           oGProject.opaths[sFromStationName+"_"+sCheckStationName]=(++nGPathId);
                           oGProject.opaths[sFromStationName+"_"+sCheckStationName+"_link"]=1;
                        } else {
                           nLinkId=oGProject.opaths[sFromStationName+"_"+sCheckStationName+"_link"];
                           nLinkId++;
                           oGProject.opaths[sFromStationName+"_"+sCheckStationName+"_link"]=nLinkId;
                        }
                        var toLocation={x:1000,y:0,z:0};
                        switch(nLinkId){
                           case 1:toLocation={x:1000,y:0,z:0};break;
                           case 2:toLocation={x:1200,y:250,z:250};break;
                           case 3:toLocation={x:1400,y:500,z:500};break;
                           case 4:toLocation={x:1600,y:750,z:750};break;
                           case 5:toLocation={x:1800,y:1000,z:1000};break;
                           case 6:toLocation={x:2000,y:1250,z:1250};break;
                           case 7:toLocation={x:2200,y:1500,z:1500};break;
                        }
                        lselections.push({"object":"Split mount","name":"Link","selection":"1","fromi":0,"toi":0,"sname":"1"});
                        lselections.push({"object":"Link","name":"From Station","selection":sCheckStationName,"fromi":0,"toi":0,"sname":sCheckStationName,"location":toLocation});
                        lselections.push({"object":"Link","name":"To Station","selection":sFromStationName,"fromi":0,"toi":0,"sname":sFromStationName,"location":toLocation});
                        lselections.push({"object":"Link","name":"Path id","selection":(nGPathId).toString(),"fromi":0,"toi":0,"sname":(nGPathId).toString(),"location":toLocation,"pathinfotostation":sFromStationName});
                        lselections.push({"object":"Link","name":"Link id","selection":(nLinkId).toString(),"fromi":0,"toi":0,"sname":(nLinkId).toString(),"location":toLocation});
                        oGSolutions[x].linkupdate=[];
                        oGSolutions[x].linkupdate.push({"object":"Link","name":"Path id","selection":(nGPathId).toString(),"fromi":0,"toi":0,"sname":(nGPathId).toString(),"location":lLocation,"pathinfotostation":sCheckStationName});
                        oGSolutions[x].linkupdate.push({"object":"Link","name":"Link id","selection":(nLinkId).toString(),"fromi":0,"toi":0,"sname":(nLinkId).toString(),"location":lLocation});
                        lUpdateStations.push(oGSolutions[x]);
                        oCurrStation=JSON.parse(JSON.stringify({"name":sCheckStationName,"links":[],"lselections":lselections}));
                        oCurrLink=JSON.parse(JSON.stringify({"To Station":sCheckStationName}));
                        oCurrStation.links.push(oCurrLink);
                        lAddStations.push(oCurrStation);
                     }
                  }
               }
            }

         }
      }
   }
   for(var x in lAddStations){
      var sAddedObjectID=doCreateNewSolutionId();
      var oOBs={id:sAddedObjectID,"ZCONFIG_ID":sAddedObjectID,"name":lAddStations[x].name,linkupdate:JSON.parse(JSON.stringify(lAddStations[x].lselections)),"objects":[]};
      oGSolutions.push(oOBs);
      //doConfigure(oOBs.ZCONFIG_ID);
      bNewStations=true;
   }
   for(var x in lUpdateStations){
      //doConfigure(UpdateStations[x].ZCONFIG_ID);
   }
   if(bNewStations) doUpdateSolutionList();
   */
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doHandleEditMode(){
  //Check free requirement list
  //Set default value as selected now!!!
  for(var z in oGActiveSolution.objects) {
      if(oGActiveSolution.objects[z].requirements) {
         for(var zz=0;zz<oGActiveSolution.objects[z].requirements.length;zz++) {
            //if((oGActiveSolution.objects[z].requirements[zz].capacity||0)>(oGActiveSolution.objects[z].requirements[zz].capacityServed||0)) {
               //if((oGActiveSolution.objects[z].requirements[zz].type||"").toUpperCase()!="STATEMENT") sStatus=" list-group-item-info";
               var sTools="<a href='#' onclick='doAddNewModelObject({services:[{service:\""+(oGActiveSolution.objects[z].requirements[zz].requirement||"?")+"\"}]});doConfigure(sGSelectedConfigurationID);' title='Add service object' style='float:right;'>+</a>";
               if((oGActiveSolution.objects[z].requirements[zz].attribute||"")!="") sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"attribute\",\"-\");' title='Clear attribute settings.' style='float:right;'>-</a>";
               sTools+="<a href='#' onclick='$(\"#myModelObjectListFilter\").val(\""+(oGActiveSolution.objects[z].requirements[zz].requirement||"")+"\");doUpdateModelObjectList();' title='List object with the service needed!' style='float:right;'>?</a>";
               sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"tab\",\"New tab "+(nGTabIndex)+"\");nGTabIndex++;' title='Move this attribute under a new tab.' style='float:right;'>T</a>";
               if((oGActiveSolution.objects[z].requirements[zz].attribute||"")=="") sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"attribute\",\"capacity\");' title='Make this requirement as a visible capacity attribute.' style='float:right;'>C</a>";
               if((oGActiveSolution.objects[z].requirements[zz].attribute||"")=="") sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"attribute\",\"selection\");' title='Make this requirement as a visible seletion attribute.' style='float:right;'>S</a>";
               if((oGActiveSolution.objects[z].requirements[zz].attribute||"")=="") sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"attribute\",\"picklist\");doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"static\",\"true\");' title='Make this requirement as a visible picklist.' style='float:right;'>P</a>";
               if((oGActiveSolution.objects[z].requirements[zz].attribute||"No attribute?").toUpperCase()=="SELECTION") sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"dynamic\",\"true\");' title='Make this requirement as a options attribute.' style='float:right;'>O</a>";
               if(((oGActiveSolution.objects[z].requirements[zz].attribute||"No attribute?").toUpperCase()=="SELECTION")&&((oGActiveSolution.objects[z].requirements[zz].value||"")!="")) sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"default_selection\",\""+(oGActiveSolution.objects[z].requirements[zz].value||1)+"\");' title='Set this as a default value' style='float:right;'>D</a>";
               if((oGActiveSolution.objects[z].requirements[zz].attribute||"No attribute?").toUpperCase()=="CAPACITY") sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"checkbox\",\"true\");doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"capacity\",\"0\");' title='Make this requirement as a visible checkbox attribute.' style='float:right;'>#</a>";
               if(((oGActiveSolution.objects[z].requirements[zz].attribute||"No attribute?").toUpperCase()=="CAPACITY")&&((oGActiveSolution.objects[z].requirements[zz].capacity||1)!=1)) sTools+="<a href='#' onclick='doSetModelReqAttr(\""+(oGActiveSolution.objects[z].requirements[zz].id||"No id")+"\",\"capacity\",\""+(oGActiveSolution.objects[z].requirements[zz].capacity||1)+"\");' title='Set this as a default capacity value' style='float:right;'>D</a>";
               $("#EDIT"+(oGActiveSolution.objects[z].requirements[zz].id||"No id")).html(sTools);
            //}
         }
      }
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doSetModelAttr(sInSolutionReqId,sInAttrName,sInAttrValue){
   try{
      var oSolObject=lGObjectsByReqId[sInSolutionReqId];
      for(var i=0;i<oGActiveModel.objects.length;i++) {
         if(oGActiveModel.objects[i].name==(oSolObject.name||"no name?")) {
            oGActiveModel.objects[i][sInAttrName]=sInAttrValue;
         }
      }
   } catch(errori){}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doSetModelReqAttr(sInSolutionReqId,sInAttrName,sInAttrValue){
   try{
      var nReqObjectIndex=-1;
      var oSolObject=lGObjectsByReqId[sInSolutionReqId];
      for(var k in oSolObject.requirements){
         if(oSolObject.requirements[k].id==sInSolutionReqId){
            nReqObjectIndex=k;
         }
      }
      if(nReqObjectIndex>=0){
         for(var i=0;i<oGActiveModel.objects.length;i++) {
            if(oGActiveModel.objects[i].name==(oSolObject.name||"no name?")) {
               if(nReqObjectIndex<oGActiveModel.objects[i].requirements.length){
                  if(sInAttrValue=="-"){
                     oGActiveModel.objects[i].requirements[nReqObjectIndex]={requirement:oGActiveModel.objects[i].requirements[nReqObjectIndex].requirement};
                  } else {
                     if(oGActiveModel.objects[i].requirements[nReqObjectIndex][sInAttrName]!=sInAttrValue){
                        oGActiveModel.objects[i].requirements[nReqObjectIndex][sInAttrName]=sInAttrValue;
                     } else {
                        delete oGActiveModel.objects[i].requirements[nReqObjectIndex][sInAttrName];
                     }
                  }
               }
            }
         }
      }
   } catch(errori){}
   doConfigure(sGSelectedConfigurationID);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doShowNetwork() {
   var sSVG="",x1=0,x2=0,y1=0,y2=0,fFactor=1.0,nStrokeWidth=1,fromx=0,fromy=0,tox=0,toy=0,sHTMLSIs="",nStIndex=1;
   var sFillColor="#FFFFFF";
   bGShowNetworkView=true;
   //Update aGLinks list
   aGLinks.splice(0,aGLinks.length);
   for(var x in oGSolutions) {
      for(var jii in oGSolutions[x].objects){
         var sToStationName="";
         var sFromStationName="";
         for(var ji in oGSolutions[x].objects[jii].requirements){
            if(oGSolutions[x].objects[jii].requirements[ji].requirement=="To Station") {
               sToStationName=oGSolutions[x].objects[jii].requirements[ji].value||"";
               oGSolutions[x].objects[jii].requirements[ji].value=sToStationName;
            }
            if(oGSolutions[x].objects[jii].requirements[ji].requirement=="From Station") {
               sFromStationName=oGSolutions[x].name||"";
               oGSolutions[x].objects[jii].requirements[ji].requirement=sFromStationName;
            }
         }
         if((sFromStationName!=sToStationName)&&(sFromStationName!="")){
            aGLinks.push({from:sFromStationName,to:sToStationName,from_name:sFromStationName,to_name:sToStationName});
         }
      }
   }

   //sSVG+="<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"svg1\" width=\"100%\" height=\"400px\">";
   sHTMLSIs= "<ul class='nav nav-tabs'>";
   if(nGActiveTable==-1){
      sHTMLSIs+= "<li class='active'><a data-toggle='tab' href='#editable'>Edit</a></li>";
   } else {
      sHTMLSIs+= "<li><a data-toggle='tab' href='#editable' onclick='nGActiveTable=-1;'>Edit</a></li>";
   }
   if(nGActiveTable==0){
      sHTMLSIs+= "<li class='active'><a data-toggle='tab' href='#sitable'>Sales Items</a></li>";
   } else {
      sHTMLSIs+= "<li><a data-toggle='tab' href='#sitable' onclick='nGActiveTable=0;'>Sales Items</a></li>";
   }
   if(nGActiveTable==1){
      sHTMLSIs+= "<li class='active'><a data-toggle='tab' href='#linktable'>Links</a></li>";
   } else {
      sHTMLSIs+= "<li><a data-toggle='tab' href='#linktable' onclick='nGActiveTable=1;'>Links</a></li>";
   }
   if(nGActiveTable==2){
      sHTMLSIs+= "<li class='active'><a data-toggle='tab' href='#ansilinktable'>Links (ANSI)</a></li>";
   } else {
      sHTMLSIs+= "<li><a data-toggle='tab' href='#ansilinktable' onclick='nGActiveTable=2;'>Links (ANSI)</a></li>";
   }
   sHTMLSIs+="</ul>";
   sHTMLSIs+="<div class='tab-content'>";
   if(nGActiveTable==0){
      sHTMLSIs+= "<div id='sitable' class='tab-pane fade in active'>";
   } else {
      sHTMLSIs+= "<div id='sitable' class='tab-pane fade'>";
   }
   sHTMLSIs+=  "<table class='table'><thead><th>name</th><th>item</th><th>qty</th><th>position</th></thead>";
   var lAddStations=[],sAddedNames="";
   for(var x in oGSolutions) {
      for(var jii in oGSolutions[x].objects){
         for(var ji in oGSolutions[x].objects[jii].requirements){
            if(oGSolutions[x].objects[jii].requirements[ji].requirement=="To Station") {
               var sCheckStationName=oGSolutions[x].objects[jii].requirements[ji].value;
               if(sCheckStationName!=""){
                  var bLoytyko=false;
                  for(var y in oGSolutions){
                     if(oGSolutions[y].name==sCheckStationName){
                        bLoytyko=true;
                        for(var z in lAddStations){
                           if(lAddStations[z]==sCheckStationName){
                              bLoytyko=false;
                           }
                        }
                        break;
                     }
                  }
                  if(!bLoytyko){
                     lAddStations.push(sCheckStationName);
                  }
               }

            }
         }
      }
      sHTMLSIs+="<tr><td>Station</td><td></td><td></td><td></td></tr>";
      sHTMLSIs+="<tr class='success'><td>Indoor</td><td></td><td></td><td></td></tr>";
      for(var xx=0;xx<(oGSolutions[x].salesItemsForUI||[]).length;xx++) {
         var ocitem=oGSolutions[x].salesItemsForUI[xx];
         if((ocitem.bundle||"")=="Indoor") {
            sHTMLSIs+="<tr class='warning'><td>"+(ocitem.name||"")+"</td><td>"+(ocitem.si||"")+"</td><td>"+(ocitem.quantity||"")+"</td><td>"+(ocitem.position||"")+"</td></tr>";
            if(typeof ocitem.children!=='undefined'){
               for(var ix in ocitem.children) {
                  var ocitemi=ocitem.children[ix];
                  sHTMLSIs+="<tr class='info'><td>"+(ocitemi.name||ocitemi.txt||"")+"</td><td>"+(ocitemi.si||"")+"</td><td>"+(ocitemi.quantity||ocitemi.qty||"")+"</td><td>"+(ocitemi.position||"")+"</td></tr>";
               }
            }
         }
      }
      sHTMLSIs+="<tr class='danger'><td>Outdoor</td><td></td><td></td><td></td></tr>";
      for(var xx=0;xx<(oGSolutions[x].salesItemsForUI||[]).length;xx++) {
         var ocitem=oGSolutions[x].salesItemsForUI[xx];
         if((ocitem.bundle||"")=="Outdoor") {
            sHTMLSIs+="<tr class='warning'><td>"+(ocitem.name||"")+"</td><td>"+(ocitem.si||"")+"</td><td>"+(ocitem.quantity||"")+"</td><td>"+(ocitem.position||"")+"</td></tr>";
            if(typeof ocitem.children!=='undefined'){
               for(var ix in ocitem.children) {
                  var ocitemi=ocitem.children[ix];
                  sHTMLSIs+="<tr class='info'><td>"+(ocitemi.name||ocitemi.txt||"")+"</td><td>"+(ocitemi.si||"")+"</td><td>"+(ocitemi.quantity||ocitemi.qty||"")+"</td><td>"+(ocitemi.position||"")+"</td></tr>";
               }
            }
         }
      }
      if(typeof oGSolutions[x].sHTML3D!=='undefined') {
         sFillColor="#FFFFFF";
         if(!(oGSolutions[x].valid||false)) sFillColor="#FF3333";
         if(sGLinkFromID==oGSolutions[x].ZCONFIG_ID){sFillColor="#FFFF33";}
         if(sGLinkToID==oGSolutions[x].ZCONFIG_ID){sFillColor="#FFFF33";}
         //sSVG+="<span id=\""+(oGSolutions[x].ZCONFIG_ID)+"\" onclick=\"doSelectLinkSolution('"+(oGSolutions[x].ZCONFIG_ID)+"')\" style=\"width: 100px;height: 100px;display: inline-block;background-color:"+sFillColor+";border: 1px solid blue;\">";
         sSVG+="<span title=\""+(oGSolutions[x].name||"")+"\" id=\""+(oGSolutions[x].ZCONFIG_ID)+"\" onclick=\"doSelectLinkSolution('"+(oGSolutions[x].ZCONFIG_ID)+"')\" style=\"display: inline-block;background-color:"+sFillColor+";border: 1px solid blue;\">";
         sSVG+=oGSolutions[x].sHTML3D;
         sSVG+="</span>";

      } else {
         x1=(150*(x%4));
         x2=(150*(x%4))+100;
         y1=(50+(parseInt(x/4))*150);
         y2=(50+(parseInt(x/4))*150)+100;
         sFillColor="rgb(128,128,128)";
         sSVG+="<g id=\""+(oGSolutions[x].ZCONFIG_ID)+"\" onclick=\"doSelectLinkSolution('"+(oGSolutions[x].ZCONFIG_ID)+"')\">";
         if(sGLinkFromID==oGSolutions[x].ZCONFIG_ID){sFillColor="rgb(10,128,10)";fromx=x1+25;fromy=y1+25;}
         if(sGLinkToID==oGSolutions[x].ZCONFIG_ID){sFillColor="rgb(10,10,128)";tox=x1+25;toy=y1+25;}
         //Draw Solution:
         if(!(oGSolutions[x].valid||false)) sFillColor="#FF0000";
         sSVG+= "<polygon points=\""+parseInt(x1*fFactor)+","+parseInt(y1*fFactor)+" "+parseInt(x2*fFactor)+","+parseInt(y1*fFactor)+" "+parseInt(x2*fFactor)+","+parseInt(y2*fFactor)+" "+parseInt(x1*fFactor)+","+parseInt(y2*fFactor)+"\" style=\"fill:"+sFillColor+";stroke:rgb(0,0,0);stroke-width:"+(nStrokeWidth)+";\">";
         sSVG+=  "<title>id:"+(oGSolutions[x].ZCONFIG_ID)+" name:"+(oGSolutions[x].name)+"</title>";
         sSVG+= "</polygon>";
         sSVG+="</g>";
         //sSVG+="<text x=\""+parseInt((x1+80)*fFactor)+"\" y=\""+(parseInt(y1*fFactor)+15)+"\" fill=\"black\">"+oGSolutions[x].name+"</text>";
         sSVG+="<text x=\""+parseInt((x1+2)*fFactor)+"\" y=\""+(parseInt(y1*fFactor)+18)+"\" fill=\"black\">Station "+(nStIndex++)+"</text>";
         //Locate solution
         for(var zz in aGLinks) {
            if((aGLinks[zz].from||"")==(oGSolutions[x].ZCONFIG_ID||"No id")) {
               aGLinks[zz].x1=x1+25+(zz*2);
               aGLinks[zz].y1=y1+25+(zz*2);
            } else if((aGLinks[zz].to||"")==(oGSolutions[x].ZCONFIG_ID||"No id")) {
               aGLinks[zz].x2=x1+25+(zz*2);
               aGLinks[zz].y2=y1+25+(zz*2);
            }
         }
      }
      for(var i in aGLinks) {
         sSVG+="<line x1='"+aGLinks[i].x1+"' y1='"+aGLinks[i].y1+"' x2='"+aGLinks[i].x2+"' y2='"+aGLinks[i].y2+"' style='stroke:rgb(255,0,0);stroke-width:2'/>";
      }
   }
   //sSVG+="</svg>"+sHTMLSIs
   sHTMLSIs+=  "</table>";
   sHTMLSIs+= "</div>";
   if(nGActiveTable==-1){
      sHTMLSIs+= "<div id='editable' class='tab-pane fade in active'>";
   }else{
      sHTMLSIs+= "<div id='editable' class='tab-pane fade'>";
   }
   //**********************************************************OAPI rendering**************************************************************** */
   var oTableRows={};
   for(var x in oGSolutions) {
      sHTMLSIs+=  "<p>"+(oGSolutions.name||"Solution")+"</p>";
      sHTMLSIs+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
      sHTMLSIs+=   "<thead><th>Name</th><th>Value</th></thead>";
      oTableRows={};
      if(oGSolutions[x].oapi){
         for(var jii in oGSolutions[x].oapi.objects){
            if(typeof oTableRows[oGSolutions[x].oapi.objects[jii].category]==='undefined'){
               oTableRows[oGSolutions[x].oapi.objects[jii].category]=[];
            }
            oTableRows[oGSolutions[x].oapi.objects[jii].category].push(oGSolutions[x].oapi.objects[jii]);
         }
      }
      for(var jii in oTableRows){
         sHTMLSIs+=    "<tr><td>"+jii+"</td><td>";
         for(var jij in oTableRows[jii]){
            if((oTableRows[jii][jij].UI_el||"")=="checkbox"){
               sHTMLSIs+=    "<input type=\"checkbox\" "+((oTableRows[jii][jij].selected||false) ? "checked":"");
               sHTMLSIs+=    " onclick=\""+(oTableRows[jii][jij].onclick||"")+"\">&nbsp;"+oTableRows[jii][jij].name+"&nbsp;";
            } else if((oTableRows[jii][jij].UI_el||"")=="number"){
               sHTMLSIs+=    "<input type=\"text\" onblur=\""+(oTableRows[jii][jij].onclick||"")+"\" value=\""+(oTableRows[jii][jij].value||0)+"\">";
            } else {
               sHTMLSIs+="<span "+((oTableRows[jii][jij].css||false) ? "css=\""+oTableRows[jii][jij].css+"\"":"")+">";
               sHTMLSIs+=    "<a href=\"#\" onclick=\""+(oTableRows[jii][jij].onclick||"")+"\">"+((oTableRows[jii][jij].selected||false) ? "*":"")+oTableRows[jii][jij].name+"</a>&nbsp;";
               sHTMLSIs+="</span>";
            }
         }
         sHTMLSIs+=    "</td></tr>";
      }
      sHTMLSIs+=  "</table>";
   }
   sHTMLSIs+= "</div>";
   /********************************************************************************************************/
   if(nGActiveTable==1){
      sHTMLSIs+= "<div id='linktable' class='tab-pane fade in active'>";
   }else{
      sHTMLSIs+= "<div id='linktable' class='tab-pane fade'>";
   }
   sHTMLSIs+=  "<table class='table table-striped table-bordered table-hover table-condensed'><thead><th>Site Name</th><th>Receive Site</th><th>Radio PN</th><th>Radio Model</th><th>Protection</th><th>UBT Type</th><th>UBT Protection</th><th>UBT Polarization</th></thead>";
   for(var i in aGLinks) {
      sHTMLSIs+=    "<tr><td>"+aGLinks[i].from_name+"</td><td>"+aGLinks[i].to_name+"</td><td>-</td><td>MSS</td><td>-</td><td>C</td><td>1+0</td><td>-</td></tr>";
   }
   sHTMLSIs+=  "</table>";
   sHTMLSIs+= "</div>";
   if(nGActiveTable==2){
      sHTMLSIs+= "<div id='ansilinktable' class='tab-pane fade in active'>";
   }else{
      sHTMLSIs+= "<div id='ansilinktable' class='tab-pane fade'>";
   }
   sHTMLSIs+=  "<table class='table table-striped table-bordered table-hover table-condensed'><thead><th>Site Name</th><th>Receive Site</th><th>Radio PN</th><th>Radio Model</th><th>Protection</th><th>UBT Type</th><th>UBT Protection</th><th>UBT Polarization</th><th>Path id</th><th>Link id</th></thead>";
   var nPathId=0;
   var nCurrPathId=0;
   var nLinkId=0;
   var oPath={};
   for(var i in aGLinks) {
      if(typeof oPath[aGLinks[i].from_name+"_"+aGLinks[i].to_name]==='undefined') {
         nPathId++;
         nCurrPathId=nPathId;
         oPath[aGLinks[i].from_name+"_"+aGLinks[i].to_name]=nPathId;
         oPath[aGLinks[i].from_name+"_"+aGLinks[i].to_name+"_linkid"]=1;
         nLinkId=1;
      } else {
         nCurrPathId=oPath[aGLinks[i].from_name+"_"+aGLinks[i].to_name];
         oPath[aGLinks[i].from_name+"_"+aGLinks[i].to_name+"_linkid"]++;
         nLinkId=oPath[aGLinks[i].from_name+"_"+aGLinks[i].to_name+"_linkid"];
      }
      sHTMLSIs+=    "<tr><td>"+aGLinks[i].from_name+"</td><td>"+aGLinks[i].to_name+"</td><td>-</td><td>MSS</td><td>-</td><td>C</td><td>1+0</td><td>-</td><td>"+nCurrPathId+"</td><td>"+nLinkId+"</td></tr>";
      sHTMLSIs+=    "<tr><td>"+aGLinks[i].to_name+"</td><td>"+aGLinks[i].from_name+"</td><td>-</td><td>MSS</td><td>-</td><td>C</td><td>1+0</td><td>-</td><td>"+nCurrPathId+"</td><td>"+nLinkId+"</td></tr>";
   }
   sHTMLSIs+=  "</table>";
   sHTMLSIs+= "</div>";
   sHTMLSIs+="</div>";
   $("#content").html(sSVG+sHTMLSIs);
   for(var x in lAddStations){
      var oAddedObject=doConfigure(doCreateNewSolutionId());
      doSelectSolution(oAddedObject);
      /*var oTStation={"networkViewData":{"name":lAddStations[x],"station":[{"id":"mss-4"},{"id":"coreevo_1g"}],"links":[]}};
      for(var ji in aGLinks){
         if(aGLinks[ji].from==lAddStations[x]){
            oTStation.networkViewData.links.push([{"from_station":aGLinks[ji].from_name},{"to_station":aGLinks[ji].to_name},{"id":"Link endpoint"},{"id":"ubt-c"},{"id":"antenna1-integrated"},{"id":"radio-configuration-1+0"},{"id":"frequency-13-ghz-tx1"},{"id":"ubt1-capacity-1gbit"}]);
         }
      }
      bGShowNetworkView=false;
      doPostMessage(JSON.stringify(oTStation));
      */
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doSelectLinkSolution(sInSolutionId) {
   if(sGLinkFromID=="") {
      sGLinkFromID=sInSolutionId;
      doSelectSolution(sGLinkFromID);
      sGLinkFromName=oGActiveSolution.name;
   } else {
      if(sGLinkToID=="") {
         sGLinkToID=sInSolutionId;
         doSelectSolution(sGLinkToID);
         sGLinkToName=oGActiveSolution.name;
      }
   }
   if((sGLinkToID!="")&&(sGLinkFromID!="")&&(sGLinkToID!=sGLinkFromID)) {
      //Add link
      //if((sGLinkFromID!="")&&(sGLinkToID!="")) {
      //   aGLinks.push({from:sGLinkFromID,to:sGLinkToID,from_name:sGLinkFromName,to_name:sGLinkToName,new:true});
      //}
      /*
      doSelectSolution(sGLinkFromID);
      var oTStation={"networkViewData":{"name":sGLinkFromName,"station":[{"id":"mss-4"},{"id":"coreevo_1g"}],"links":[]}};
      for(var ji in aGLinks){
         if(aGLinks[ji].from==sGLinkFromID){
            oTStation.networkViewData.links.push([{"from_station":aGLinks[ji].from_name},{"to_station":aGLinks[ji].to_name},{"id":"Link endpoint"},{"id":"ubt-c"},{"id":"antenna1-integrated"},{"id":"radio-configuration-1+0"},{"id":"frequency-13-ghz-tx1"},{"id":"ubt1-capacity-1gbit"}]);
         }
      }
      bGShowNetworkView=true;
      doPostMessage(JSON.stringify(oTStation));
      //addObject2SolutionByName('Link endpoint',1,'');

      doSelectSolution(sGLinkToID);
      var oTStation2={"networkViewData":{"name":sGLinkToName,"station":[{"id":"mss-4"},{"id":"coreevo_1g"}],"links":[]}};
      for(var ji in aGLinks){
         if(aGLinks[ji].to==sGLinkToID){
            oTStation2.networkViewData.links.push([{"from_station":aGLinks[ji].to_name},{"to_station":aGLinks[ji].from_name},{"id":"Link endpoint"},{"id":"ubt-c"},{"id":"antenna1-integrated"},{"id":"radio-configuration-1+0"},{"id":"frequency-13-ghz-tx1"},{"id":"ubt1-capacity-1gbit"}]);
         }
      }
      bGShowNetworkView=true;
      doPostMessage(JSON.stringify(oTStation2));
      */
      doSelectSolution(sGLinkFromID);
      bGShowNetworkView=true;
      addObject2SolutionByName('Link',1, '');
      //doPostMessage(JSON.stringify({networkViewData:{station:[],links:[{from_station:sGLinkFromName},{to_station:sGLinkToName},{id:"Link endpoint"},{id:"ubt-c"},{id:"antenna1-integrated"},{id:"radio-configuration-1+0"},{id:"frequency-13-ghz-tx1"},{id:"ubt1-capacity-1gbit"}]}}));
      doSelectSolution(sGLinkToID);
      bGShowNetworkView=true;
      addObject2SolutionByName('Link',1,'');
      //doPostMessage(JSON.stringify({networkViewData:{station:[],links:[{from_station:sGLinkToName},{to_station:sGLinkFromName},{id:"Link endpoint"},{id:"ubt-c"},{id:"antenna1-integrated"},{id:"radio-configuration-1+0"},{id:"frequency-13-ghz-tx1"},{id:"ubt1-capacity-1gbit"}]}}));
      sGLinkFromID="";
      sGLinkToID="";
   }
   if((sGLinkToID!="")&&(sGLinkFromID!="")&&(sGLinkToID==sGLinkFromID)) {
     doSelectSolution(sGLinkToID);
     sGLinkToID="";
     sGLinkFromID="";
   } else {
      doShowNetwork();
      doUpdateSolutionList();
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doUpdateSolutionList() {
   var bSelected=false,oLinkShown={};
   $("#showSolutions ol").html("");
   $("#showLinks ol").html("");
   for(var x in oGSolutions) {
      bSelected=false;
      if(oGSolutions[x].ZCONFIG_ID==sGSelectedConfigurationID) {
         $("#showSolutions ol").append("<li><span id='"+oGSolutions[x].ZCONFIG_ID+"'></span><a title='"+oGSolutions[x].ZCONFIG_ID+"' href='#' onclick='doSelectSolution(\""+oGSolutions[x].ZCONFIG_ID+"\")'>["+oGSolutions[x].name+"]</a><a href='#' onclick='doRemoveSolution(\""+oGSolutions[x].ZCONFIG_ID+"\")' title='Remove this solution'><span class='glyphicon glyphicon-remove'></span></a><a href='#' onclick='doCopyConfiguration(\""+oGSolutions[x].ZCONFIG_ID+"\")' title='Copy this solution'><span class='glyphicon glyphicon-copy'></span></a></li>");
         bSelected=true;
	   } else {
         $("#showSolutions ol").append("<li><span id='"+oGSolutions[x].ZCONFIG_ID+"'></span><a title='"+oGSolutions[x].ZCONFIG_ID+"' href='#' onclick='doSelectSolution(\""+oGSolutions[x].ZCONFIG_ID+"\")'>"+oGSolutions[x].name+"</a><a href='#' onclick='doRemoveSolution(\""+oGSolutions[x].ZCONFIG_ID+"\")' title='Remove this solution'><span class='glyphicon glyphicon-remove'></span></a><a href='#' onclick='doCopyConfiguration(\""+oGSolutions[x].ZCONFIG_ID+"\")' title='Copy this solution'><span class='glyphicon glyphicon-copy'></span></a></li>");
      }
      if((oGSolutions[x].lGSelections||[]).length>0) {
         for(var y in oGSolutions[x].lGSelections){
            if((oGSolutions[x].lGSelections[y].object||"")=="Link") {
               if((oGSolutions[x].lGSelections[y].name||"")=='Path id') {
                  if(typeof oLinkShown[(oGSolutions[x].lGSelections[y].selection||"no")]==='undefined') {
                     oLinkShown[(oGSolutions[x].lGSelections[y].selection||"no")]=true;
                     if(bSelected){
                        $("#showLinks ol").append("<li><span id='"+oGSolutions[x].ZCONFIG_ID+"'></span><a title='"+oGSolutions[x].ZCONFIG_ID+"' href='#'>[From Station:"+oGSolutions[x].name+" To Station: "+(oGSolutions[x].lGSelections[y]["pathinfotostation"]||"")+"]</a></li>");
                     } else {
                        $("#showLinks ol").append("<li><span id='"+oGSolutions[x].ZCONFIG_ID+"'></span><a title='"+oGSolutions[x].ZCONFIG_ID+"' href='#'>From Station:"+oGSolutions[x].name+" To Station: "+(oGSolutions[x].lGSelections[y]["pathinfotostation"]||"")+"</a></li>");
                     }
                  }
               }
            }
         }
      }
   }
   if(bGShowNetworkView) doShowNetwork();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doCreateCableConnectionRule() {
   oGCableRule={};
   if(!bGCableRuleCreationMode){
      $("#sObject").val("Cable creation rule activated...");
      bGCableRuleCreationMode=true;
   } else {
      $("#sObject").val("Cable creation rule stopped...");
      bGCableRuleCreationMode=false;
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doSelectPort(sInULocation,sInPortName,nInX,nInY,nInZ) {
   if(typeof oGCableRule.requirements==='undefined'){
      //From:
      //oGCableRule.from=sInULocation+":"+sInPortName;
      oGCableRule.requirements=[];
      oGCableRule.requirements.push({"requirement":sInULocation+":"+sInPortName,"description":"1st end","type":"react"});
   } else {
      //To 36OU:

      var nptX=0,nptY=1610;//U1
      if(nInY>=(44,45*2)) nptY=1521;//U3
      if(nInY>=(44,45*4)) nptY=1432;//U5
      if(nInY>=(44,45*6)) nptY=1343;//U7

      if(nInY>=(44,45*11)) nptY=1387;//U12
      if(nInY>=(44,45*13)) nptY=1299;//U14
      if(nInY>=(44,45*15)) nptY=1210;//U16
      if(nInY>=(44,45*17)) nptY=1121;//U18
      if(nInY>=(44,45*19)) nptY=1031;//U20

      //36: if(nInY>=(44,45*21)) nptY=943;//U22

      if(nInY>=(44,45*23)) nptY=854;//U24
      if(nInY>=(44,45*25)) nptY=765;//U26
      if(nInY>=(44,45*27)) nptY=676;//U28
      //36: if(nInY>=(44,45*28)) nptY=631;//U29
      if(nInY>=(44,45*29)) nptY=587;//U30

      if(nInY>=(44,45*34)) nptY=362;//U35
      if(nInY>=(44,45*36)) nptY=276;//U37
      if(nInY>=(44,45*37)) nptY=187;//U38
      if(nInY>=(44,45*39)) nptY=98;//U40

     //To: 42OU
     /*
     var nptX=0,nptY=1876;//U1
     if(nInY>=(44.45*2)) nptY=1788;//U3
     if(nInY>=(44.45*4)) nptY=1699;//U5
     if(nInY>=(44.45*6)) nptY=1610;//U7

     if(nInY>=(44.45*11)) nptY=1387;//U12
     if(nInY>=(44.45*13)) nptY=1299;//U14
     if(nInY>=(44.45*15)) nptY=1210;//U16
     if(nInY>=(44.45*17)) nptY=1121;//U18

     //36: if(nInY>=(44,45*21)) nptY=943;//U22

     if(nInY>=(44.45*23)) nptY=854;//U24
     if(nInY>=(44.45*25)) nptY=765;//U26
     if(nInY>=(44.45*27)) nptY=676;//U28
     //36: if(nInY>=(44,45*28)) nptY=631;//U29
     if(nInY>=(44.45*29)) nptY=587;//U30

     if(nInY>=(44.45*34)) nptY=362;//U35
     if(nInY>=(44.45*36)) nptY=276;//U37
     if(nInY>=(44.45*37)) nptY=187;//U38
     if(nInY>=(44.45*39)) nptY=98;//U40
    */
      switch(sInPortName){
         case "P1":
            nptX=753;
            if(nInX>155) nptX=1247;
            if(nInX>310) nptX=1740;
            break;
         case "P2":
            nptX=822;
            if(nInX>155) nptX=1316;
            if(nInX>310) nptX=1808;
            break;
         case "P3":
            nptX=891;
            if(nInX>155) nptX=1385;
            if(nInX>310) nptX=1877;
            break;
         case "P4":
            nptX=960;
            if(nInX>155) nptX=1454;
            if(nInX>310) nptX=1946;
            break;
         case "P5":
            nptX=1028;
            if(nInX>155) nptX=1522;
            if(nInX>310) nptX=2015;
            break;
         case "P6":
            nptX=1097;
            if(nInX>155) nptX=1591;
            if(nInX>310) nptX=2083;
            break;
         case "S1":
            nptX=1028;
            if(nInX>155) nptX=1522;
            if(nInX>310) nptX=2015;
            break;
         case "S2":
            nptX=1097;
            if(nInX>155) nptX=1591;
            if(nInX>310) nptX=2083;
            break;
      }
      oGCableRule.requirements.push({"requirement":sInPortName,"description":"2nd end","location":{"x":nInX,"y":nInY,"z":nInZ},"type":"react","pt_location":{"x":nptX,"y":nptY}});
      //Add connectivity info if more than 1 second ends "connectivity":"U23:P14/4"
      if(oGCableRule.requirements.length>2){
         var sConnectivity="";
         sConnectivity=oGCableRule.requirements[0].requirement;
         for(var i=1;i<oGCableRule.requirements.length;i++){
            oGCableRule.requirements[i].connectivity=sConnectivity+"/"+i;
         }
      }
      $("#sObject").val(JSON.stringify(oGCableRule));
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doEditSolutionComponent(sInObjectId) {
   oGSelectedItem=doGetObjectById(sInObjectId);
   var oInObject=oGSelectedItem;
   var nLevel=0;
   aGAttrList.splice(0,aGAttrList.length);
   var sHTML="",sIMG="";
   sHTML+="<div style=\"position: relative;\" class=\"panel panel-primary\">";
   sHTML+= "<div id=\"hdngcmpnnt\" class=\"panel-heading\">";
   sHTML+=  "<span>Component</span>";
   sHTML+=  "<span style=\"float: right;\">";
   sHTML+=  "<i title=\"Copy\" class=\"fa fa-clone\" onclick=\"doCopyObjectByName('"+(oInObject.name)+"')\" style=\"font-size:24px\"></i>";
   sHTML+=  "<span>&nbsp;</span>";
   sHTML+=  "<span>&nbsp;</span>";
   if(!(oInObject.id))sHTML+=  "<i title=\"Add object to Solution\" class=\"fa fa-gears\" onclick=\"addObject2SolutionByName('"+(oInObject.name)+"',1,'');\" style=\"font-size:24px\"></i>";
   sHTML+=  "<span>&nbsp;</span>";
   sHTML+=  "<span>&nbsp;</span>";
   if((oInObject.id)&&(!oInObject.components))sHTML+="<i title=\"Create a new template\" class=\"fa fa-tag\" onclick=\"doCreateTemplate('"+(oInObject.id)+"','"+(oInObject.name)+"');\" style=\"font-size:24px\"></i>";
   sHTML+=  "<span>&nbsp;</span>";
   sHTML+=  "<span>&nbsp;</span>";
   if(oInObject.id){
      sHTML+=  "<i title=\"Remove object from Solution\" class=\"fa fa-trash-o\" onclick=\"removeObjectFromSolutionById('"+(oInObject.id)+"');\" style=\"font-size:24px\"></i>";
   } else {
      sHTML+=  "<i title=\"Remove object from Model\" class=\"fa fa-trash-o\" onclick=\"removeObjectFromModelByName('"+(oInObject.name)+"');\" style=\"font-size:24px\"></i>";
   }
   sHTML+=  "</span>";
   sHTML+=  "<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\" style=\"position: absolute; top:4px; right: 2px;\" onClick=\"document.getElementById('content').innerHTML='';\"></span>";
   sHTML+= "</div>";
   sHTML+= "<div class=\"panel-body\"><div id=\"L"+(oInObject.id||"NA")+"\">";
   aGAttrList.push(oInObject);
   for(var key in oInObject) {
      if((key.toUpperCase()=="IMAGE")&&(oInObject[key].url.indexOf(".png")>0)) {
         sIMG+="<div style=\"position: relative;\">";
         sIMG+= "<img alt='Image not found? ["+oInObject[key].url+"]' draggable=\"false\" src=\""+oInObject[key].url+"\" style=\"width:100%;border:0;\" onclick=\"$('#showCoordinatesid').html('[x:'+parseInt(event.pageX-$(this).offset().left)+',y:'+parseInt(event.pageY-$(this).offset().top)+']');\"/>";
         sIMG+= "<span id=\"showCoordinatesid\" style=\"position: absolute; left: 0; top: 50%; width: 100%; text-align: center; font-size: 18px; color:red;\"></span>";
         sIMG+="</div>";
      }
      sHTML+=sGetAttributeHTML(key,oInObject[key],nLevel);
   }//for(var key in oInObject)
   if(sIMG!="")sHTML+=sIMG;
   sHTML+= "</div>";
   var sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
   sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
   sHTML+="<div class=\"row\">";
   sHTML+= "<div class=\"col-sm-3\">";
   sHTML+=  "<i title=\"Add new attribute\" class=\"fa fa-plus\" onClick=\"document.getElementById('"+sNewAttr+"').setAttribute('style','visibility: visible;border-left: 6px solid blue;')\" style=\"font-size:24px\"></i>";
   sHTML+=  "<i title=\"Add new Service\" class=\"fa fa-tags\" style=\"font-size:24px;color:green\" onClick=\"(aGAttrList["+nLevel+"].services ? aGAttrList["+nLevel+"].services.push({'service':'new service'}):aGAttrList["+nLevel+"].services=[{'service':'new service'}]);\" style=\"font-size:24px\"></i>";
   sHTML+=  "<i title=\"Add new Requirement\" class=\"fa fa-tags\" style=\"font-size:24px;color:red\" onClick=\"(aGAttrList["+nLevel+"].requirements ? aGAttrList["+nLevel+"].requirements.push({'requirement':'new requirement'}):aGAttrList["+nLevel+"].requirements=[{'requirement':'new requirement'}]);\" style=\"font-size:24px\"></i>";
   if(!oInObject.location)sHTML+=  "<span title=\"Add new location\" style=\"font-size:24px;color:lightblue\" onClick=\"aGAttrList["+nLevel+"].location={'x':0,'y':0,'z':0,'unit':'mm'};\" class=\"glyphicon glyphicon-map-marker\"></span>";
   if(!oInObject.dimensions)sHTML+=  "<i title=\"Add dimensions\" style=\"font-size:24px;color:lightgreen\" class=\"fa fa-cube\" onClick=\"aGAttrList["+nLevel+"].dimensions={'width':0,'height':0,'depth':0,'unit':'mm'};\"></i>";
   sHTML+= "</div>";
   sHTML+= "<div class=\"col-sm-9\">";
   sHTML+=  "<input id=\""+sNewAttr+"\" style=\"visibility:hidden;border-left: 6px solid blue;\" class=\"form-control\" type=\"text\" onblur=\"aGAttrList["+nLevel+"][this.value]='value';$('#L"+(oInObject.id||"NA")+"').append(sGetAttributeHTML(this.value,'',"+nLevel+"));\"/>";
   sHTML+= "</div>";
   sHTML+="</div>";
   sHTML+="<div class=\"row\">";
   sHTML+= "<div class=\"col-sm-12\">";
   sHTML+=  "<textarea class=\"form-control\" rows=\"12\" id=\"sObjectTxt\">"+JSON.stringify(oInObject)+"\"</textarea>";
   sHTML+= "</div>";
   sHTML+="</div>";
   sHTML+= "</div>";
   sHTML+="</div>";
   document.getElementById("content").innerHTML=sHTML;
   sGAssetVisited="";sSGVvisited="";
   var nLocX=0.0;
   var nLocY=0.0;
   var nLocZ=0.0;
   if(oInObject.location) {
      nLocX=parseFloat(oInObject.location.x||0.0);
      nLocY=parseFloat(oInObject.location.y||0.0);
      nLocZ=parseFloat(oInObject.location.z||0.0);
   }
   //Original:
   var sPHTML="<svg id=\"svg2\" width=\"100%\" height=\""+(600)+"px\">"+doGetSVG4Object(sInObjectId,{},"",nLocX,nLocY,nLocZ,nGLayers,0,0,0)+"</svg>";
   //WebGL: var sPHTML="<svg id=\"svg2\" width=\"100%\" height=\""+(600)+"px\">"+doGetSVG4Object(sInObjectId,{},"",nLocX,nLocY,nLocZ,nGLayers,0,0,0)+"</svg>";
   //var sPHTML="<svg id=\"svg2\" width=\"100%\" height=\""+(600)+"px\">"+doGetSVG4Object2(sInObjectId)+"</svg>";

   sPHTML+="<div><div>x angle <span class=\"badge\">"+nGxkierto+"</span> y angle <span class=\"badge\">"+nGykierto+"</span>z angle<span class=\"badge\">"+nGzkierto+"</span>Size<span class=\"badge\">"+fGsize.toPrecision(2)+"</span>Show layers<span class=\"badge\">"+nGLayers+"</span>Y shift<span class=\"badge\">"+nGYshift+"</span></div><div class=\"btn-group\">";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxkierto+=10;doEditSolutionComponent('"+sInObjectId+"');\">X-angle+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxkierto-=10;doEditSolutionComponent('"+sInObjectId+"');\">X-angle-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGykierto+=10;doEditSolutionComponent('"+sInObjectId+"');\">Y-angle+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGykierto-=10;doEditSolutionComponent('"+sInObjectId+"');\">Y-angle-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGzkierto+=10;doEditSolutionComponent('"+sInObjectId+"');\">Z-angle+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGzkierto-=10;doEditSolutionComponent('"+sInObjectId+"');\">Z-angle-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"fGsize+=0.05;doEditSolutionComponent('"+sInObjectId+"');\">Size+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"fGsize-=0.05;doEditSolutionComponent('"+sInObjectId+"');\">Size-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGLayers++;doEditSolutionComponent('"+sInObjectId+"');\">Layers+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGLayers--;doEditSolutionComponent('"+sInObjectId+"');\">Layers-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGYshift+=50;doEditSolutionComponent('"+sInObjectId+"');\">Y+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGYshift-=50;doEditSolutionComponent('"+sInObjectId+"');\">Y-</button>";
   sPHTML+="</div></div>";
   try{document.getElementById("show3DSlot").innerHTML=sPHTML;}catch(e){console.log("SVG creation problem??:"+e.message);}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doEditMode(){
   //Go through free requirements list -> if no available objects from the model->show create new object with the service missing!!!
   //..Show object edit box...dimensions classification
   //Run time modeling (Edit mode)->solves the structure problem in the resource based modeling!!!!! Prototype!!!!
   //modeli while running the model and mark testcases at the same time (visibility/si list/...) add possibility to categorize in the run time and use classes!!!!!
   //No need to modify and run steps back to the point where you are->instant result of modeling visible!!!
   //Show all services and preconditions->why those are not visible
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doExportProject() {
   var today=new Date();
   var min=today.getMinutes();
   var hr=today.getHours();
   var dd=today.getDate();
   var mm=today.getMonth()+1;
   var yyyy=today.getFullYear();
   var dateTime=yyyy+"_"+mm+"_"+dd+"_"+hr+"_"+min;
   var location="Project_"+dateTime+".json";
   var oProject={name:"Project",type:"Project",created:today,solutions:[]};
   for(var i=0;i<oGSolutions.length;i++){
     var oThisSolution=oGSolutions[i];
     oThisSolution.type="Solution";
     oThisSolution.templates=oGTemplates;
     oProject.solutions.push(oThisSolution);
   }
   document.getElementById("content").innerHTML="JSON export Project file content created.";
   try {
      var blobObject=new Blob([JSON.stringify(oProject)]);
      window.navigator.msSaveBlob(blobObject,location);
   } catch(e) {
      document.getElementById("content").innerHTML="JSON export Project file content created.<br/>The browser do not support file saving?<br/>"+e.message;
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doGetNextStationId(){
   return nGNextLinkId++;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doParseCML2(sInCodeInTxt) {
   var oResultObject={};
   var vNextWord="";
   var nLoopBreak=32000;
   var aResponce=[];
   var oCurrObject={};
   var oCurrReq={};
   var oCurrModel={};
   var oCurrRule={};
   var sCurrentTab="General";
   var oCurrParentObject={};
   var bCommentRow=false;
   var bSkipNext=false;
   var bRestrictions=false;
   var bCommentBlockStarted=false;
   var nPIHW=1;
   var nPISW=1;
   var nPIService=1;
   try {
      do {
         if(!bSkipNext) {
            aResponce=doGetNextWord(sInCodeInTxt);
            vNextWord=aResponce[0];
            sInCodeInTxt=aResponce[1];
         }
         var nLength=32;
         if(sInCodeInTxt.length<nLength) nLength=sInCodeInTxt.length;
         //if(!(vNextWord.match(/(\t)|(\n)|(\r)/))) console.log("->'"+vNextWord+"' <- ("+(sInCodeInTxt.substring(0,nLength)).replace(/\r/gmi,'').replace(/\n/gmi,'').replace(/\t/gmi,'')+"..)");
         bSkipNext=false;
         switch(vNextWord) {//Handle command!
            case "/"://Handle comment row
               if(!bCommentRow) {
                  bCommentRow=true;
               } else {
                  bCommentRow=false;
                  do {
                     sInCodeInTxt=sInCodeInTxt.substr(1);
                  } while((!(sInCodeInTxt.charAt(0)).match(/(\n)|(\r)/))&&(sInCodeInTxt.length>0));
               }
               break;
            case "*":
               if(bCommentRow) { //Handle /* comment area */
                  bCommentRow=false;
                  do {
                     sInCodeInTxt=sInCodeInTxt.substr(1);
                  } while((!((sInCodeInTxt.charAt(0)).match(/(\*)/)&&(sInCodeInTxt.charAt(1)).match(/(\/)/)))&&(sInCodeInTxt.length>0));
               } else {
                  console.log("Syntax error??");
                  oCurrModel.notes+="\n\n\n**********************************\nSyntax error '=' expected '"+vNextWord+sGetExampleCode(sInCodeInTxt)+"':\n";
                  return(oResultObject);
               }
               break;
            case "piproduct":
               //Remove space(s) and take piprodict name
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //console.log("Model name:'"+vNextWord+"'");
               oCurrModel=JSON.parse('{"name":"","objects":[]}');//create object
               oCurrModel.name=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               oCurrObject=JSON.parse('{"name":"","type":"Product"}');//create object
               oCurrObject.name=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               oCurrModel.notes+="Create object with type product-> name:'"+vNextWord+"'\n";
               //Remove space(s) and take possible description "Description...."
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               if(vNextWord.charAt(0)=="\"") {
                  oCurrObject.description=vNextWord.replace(/\"/gmi,'');
               } else {
                  bSkipNext=true;
               }
               oCurrObject.requirements=[];
               oCurrModel.objects.push(oCurrObject);
               oResultObject=oCurrModel;
               oCurrParentObject=oCurrObject;
               break;
            case "pihw":
               oCurrReq=JSON.parse('{"requirement":"pihw'+(nPIHW)+'", "capacity":1}');//create object
               oCurrReq.tab="pihw"+(nPIHW);
               oCurrObject.requirements.push(oCurrReq);

               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));

               oCurrObject=JSON.parse('{"name":""}');//create object
               oCurrObject.name=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               oCurrModel.notes+="Create pihw object name:'"+vNextWord+"' -> set to parent object.\n";

               oCurrObject.services=[];
               oCurrObject.services.push({"service":"pihw"+(nPIHW++)});



               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               if(vNextWord.charAt(0)=="\"") {
                  oCurrObject.description=vNextWord.replace(/\"/gmi,'');
               } else {
                  bSkipNext=true;
               }
               oCurrObject.requirements=[];
               oCurrModel.objects.push(oCurrObject);
               oCurrParentObject=oCurrObject;
               break;
            case "pisw":
               oCurrReq=JSON.parse('{"requirement":"pisw'+(nPISW)+'", "capacity":1}');//create object
               oCurrReq.tab="pisw"+(nPISW);
               oCurrObject.requirements.push(oCurrReq);

               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrObject=JSON.parse('{"name":""}');//create object
               oCurrObject.name=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');

               oCurrObject.services=[];
               oCurrObject.services.push({"service":"pisw"+(nPISW++)});

               oCurrModel.notes+="Create pisw object name:'"+vNextWord+"' -> set to parent object.\n";
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               if(vNextWord.charAt(0)=="\"") {
                  oCurrObject.description=vNextWord.replace(/\"/gmi,'');
               } else {
                  bSkipNext=true;
               }
               oCurrObject.requirements=[];
               oCurrModel.objects.push(oCurrObject);
               oCurrParentObject=oCurrObject;
               break;
            case "piservice":
               oCurrReq=JSON.parse('{"requirement":"piservice'+(nPIService)+'", "capacity":1}');//create object
               oCurrReq.tab="piservice"+(nPIService);
               oCurrObject.requirements.push(oCurrReq);

               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrObject=JSON.parse('{"name":""}');//create object
               oCurrObject.name=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');

               oCurrObject.services=[];
               oCurrObject.services.push({"service":"piservice"+(nPIService++)});

               oCurrModel.notes+="Create piservice object name:'"+vNextWord+"' -> set to parent object.\n";
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               if(vNextWord.charAt(0)=="\"") {
                  oCurrObject.description=vNextWord.replace(/\"/gmi,'');
               } else {
                  bSkipNext=true;
               }
               oCurrObject.requirements=[];
               oCurrModel.objects.push(oCurrObject);
               oCurrParentObject=oCurrObject;
               break;
            case "#":// #'sales item objectid' service|service_rule_qty
               oCurrReq=JSON.parse('{"requirement":"", "capacity":0}');//create object
               oCurrReq.tab=sCurrentTab;
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrReq.requirement=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               oCurrModel.notes+="Requirement capacity calculation rule for '"+oCurrReq.requirement+"' in the object '"+(oCurrParentObject.name||"?")+"'\n";
               if(typeof oCurrParentObject.requirements==='undefined') oCurrParentObject.requirements=[];
               oCurrParentObject.requirements.push(oCurrReq);
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //Get capacity rule
               if(vNextWord.match(/\=/)) {
                  aResponce=doGetStatement(sInCodeInTxt);//Get formula!
                  oCurrReq.rule_capacity=aResponce[0];
                  oCurrReq.capacity=1;
                  sInCodeInTxt=aResponce[1];
                  oCurrModel.notes+=aResponce[2];
                  bSkipNext=false;
                  oCurrModel.notes+="->Capacity:'"+oCurrReq.capacity+"':\n";
               } else {
                  oCurrModel.notes+="\n\n\n**********************************\nSyntax error '=' expected '"+vNextWord+sGetExampleCode(sInCodeInTxt)+"':\n";
                  return(oResultObject);
               }
               break;
            case "check":// check command?????
               //Get rule
               aResponce=doGetStatement(sInCodeInTxt);
               var sTmpStatement=aResponce[0];
               sInCodeInTxt=aResponce[1];
               oCurrModel.notes+=aResponce[2];
               bSkipNext=false;
               oCurrModel.notes+="\nCheck rule:'"+sTmpStatement+"'\n";
               break;
            case "var":
               oCurrReq=JSON.parse('{"requirement":"","attribute":"capacity","static":true,"capacity":0}');//create object
               oCurrReq.tab=sCurrentTab;
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrReq.requirement=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               oCurrModel.notes+="Object '"+(oCurrObject.name||"?")+"' -> Create static requirement - name:'"+oCurrReq.requirement+"':\n";
               if(typeof oCurrObject.requirements==='undefined') oCurrObject.requirements=[];
               oCurrObject.requirements.push(oCurrReq);
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //Get rule
               var sRule="";
               if(vNextWord.match(/\=/)) {
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                  do {
                     sRule+=vNextWord+" ";
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                  } while((sInCodeInTxt!="")&&("[var][si][pihw][pisw]".indexOf("["+vNextWord+"]")<0));
                  if(typeof oCurrReq.rules==='undefined') oCurrReq.rules=[];
                  oCurrReq.rules.push({"qty_rule":sRule});
                  bSkipNext=true;
                  oCurrModel.notes+="->Capacity rule '"+sRule+"':\n";
               } else {
                  oCurrModel.notes+="\n\n\n**********************************\nSyntax error '=' expected '"+vNextWord+sInCodeInTxt+"':\n";
                  return(oResultObject);
               }
               break;
            case "tab":
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //console.log("Get current tab name:'"+vNextWord+"'");
               sCurrentTab=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               bSkipNext=true;
               if(vNextWord.match(/\"/)) {
                  sCurrentTab=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                  bSkipNext=false;
               }
               break;
            case "param":
               oCurrReq=JSON.parse('{"requirement":"","attribute":"capacity","static":true,"capacity":0}');//create object
               oCurrReq.tab=sCurrentTab;
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrReq.requirement=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               bSkipNext=true;
               if(vNextWord.match(/\"/)) {
                  oCurrReq.name=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                  bSkipNext=false;
               }
               if(typeof oCurrObject.requirements==='undefined') oCurrObject.requirements=[];
               oCurrObject.requirements.push(oCurrReq);
               oCurrModel.notes+="Param-> requirement:'"+oCurrReq.requirement+"' (name='"+(oCurrReq.name||"-")+"') for object '"+(oCurrObject.name||"?")+"'\n";
               break;
            case "restrictions":
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //console.log("Get restriction rules for requirement:'"+(oCurrReq.name||oCurrReq.requirement)+"'");
               bRestrictions=true;
               break;
            case "in"://Remove space(s) and row change
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\n")||(vNextWord=="\r"))&&(sInCodeInTxt.length>0));
               if(vNextWord=="*") {//*0 .. 3 *v ""
                  //Remove space(s) tabs and return(s)
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                  var sGetMINMAX="";
                  sGetMINMAX=vNextWord;
                  do {
                     if(sInCodeInTxt.charAt(0)!=" ") sGetMINMAX+=sInCodeInTxt.charAt(0);
                     sInCodeInTxt=sInCodeInTxt.substr(1);
                  } while(!((sInCodeInTxt.charAt(0)||"").match(/(\n)|(\r)/))&&(sInCodeInTxt!=""));
                  if(sGetMINMAX.match(/\.\./)) {
                     try {//Min value
                        var fMinValue=parseFloat(sGetMINMAX.split("..")[0]||"0");
                        oCurrReq.capacity=fMinValue;
                        var fMaxValue=fMinValue;
                        //Max value
                        //Check if max value has default setting
                        if((sGetMINMAX.split("..")[1]||"0").match(/\*/)) {
                           fMaxValue=parseFloat((sGetMINMAX.split("..")[1]||"0").replace(/\*/,''));
                           oCurrReq.capacity=fMaxValue;
                        } else {
                           fMaxValue=parseFloat(sGetMINMAX.split("..")[1]||"0");
                        }
                        oCurrReq.min=fMinValue;
                        oCurrReq.max=fMaxValue;
                        oCurrReq.static=false;
                     } catch(e) {
                        oCurrModel.notes+="Syntax error in MIN/MAX settings->"+vNextWord+sInCodeInTxt;
                        return(oCurrModel);
                     }
                  }
               } else if(vNextWord=="{") {
                  //Remove space(s) tabs and return(s)
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                  oCurrReq.options=[];
                  var nValueIndex=0;
                  var bIsDefault=false;
                  do {
                     if(vNextWord=="*") {//set option to default
                        oCurrReq.value=nValueIndex.toString();
                        bIsDefault=true;
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     } else {
                        var sAttrValue=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                        var sAttrName=sAttrValue;
                        var sDescription="";
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        if(vNextWord.match(/\"/)) {
                           sDescription=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                           do {
                              aResponce=doGetNextWord(sInCodeInTxt);
                              vNextWord=aResponce[0];
                              sInCodeInTxt=aResponce[1];
                           } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        }
                        oCurrReq.options.push({"name":(sDescription||sAttrName),"description":(sDescription||sAttrName),"value":sAttrValue,"capacity":0});
                        if(bIsDefault) oCurrReq.value=sAttrValue.toString();
                        nValueIndex++;
                        bIsDefault=false;
                     }
                  } while((vNextWord!="}")&&(sInCodeInTxt.length>0));
                  oCurrReq['attribute']="selection";
                  oCurrReq['reconfigure']="x";
               } else if(vNextWord=="number") {

               } else if(vNextWord=="string") {

               } else {
                  var sGetMINMAX="";
                  sGetMINMAX=vNextWord;
                  do {
                     if(sInCodeInTxt.charAt(0)!=" ") sGetMINMAX+=sInCodeInTxt.charAt(0);
                     sInCodeInTxt=sInCodeInTxt.substr(1);
                  } while(!((sInCodeInTxt.charAt(0)||"").match(/(\n)|(\r)/))&&(sInCodeInTxt!=""));
                  if(sGetMINMAX.match(/\.\./)) {
                     try {
                        //Min value
                        var fMinValue=parseFloat(sGetMINMAX.split("..")[0]||0);
                        //Max value
                        var fMaxValue=parseFloat(sGetMINMAX.split("..")[1]||0);
                        if((sGetMINMAX.split("..")[1]||"0").match(/\*/)) {
                           fMaxValue=parseFloat((sGetMINMAX.split("..")[1]||"0").replace(/\*/,''));
                           oCurrReq.capacity=fMaxValue;
                        } else {
                           fMaxValue=parseFloat(sGetMINMAX.split("..")[1]||"0");
                        }
                        oCurrReq.min=fMinValue;
                        oCurrReq.max=fMaxValue;
                     } catch(e) {
                        oCurrModel.notes+="Syntax error in MIN/MAX settings->"+vNextWord+sInCodeInTxt;
                        return(oCurrModel);
                     }
                  }
               }
               oCurrModel.notes+="in for:'"+oCurrReq.requirement+"' attribute:'"+(oCurrReq.attribute||"-")+"' (name='"+(oCurrReq.name||"-")+"') for object '"+(oCurrObject.name||"?")+"'\n";
               break;
             case "notin":
               //Remove space(s) and row change
               //console.log("notin");
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\n")||(vNextWord=="\r"))&&(sInCodeInTxt.length>0));
               //console.log("Get option type '{' or * :'"+vNextWord+"'");
               if(vNextWord=="*") {//*0 .. 3 *v ""
                  //Remove space(s) tabs and return(s)
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
               } else if(vNextWord=="{") {
                  //Remove space(s) tabs and return(s)
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                  oCurrReq.options=[];
                  do {
                     if(vNextWord=="*") {//set option to default
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     } else {
                        var sAttrValue=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                        var sAttrName=sAttrValue;
                        var sDescription="";
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        if(vNextWord.match(/\"/)) {
                           sDescription=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                           do {
                              aResponce=doGetNextWord(sInCodeInTxt);
                              vNextWord=aResponce[0];
                              sInCodeInTxt=aResponce[1];
                           } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        }
                        oCurrReq.options.push({"name":(sAttrName||sDescription),"description":(sDescription||sAttrName),"value":sAttrValue,"capacity":0});
                     }
                  } while((vNextWord!="}")&&(sInCodeInTxt.length>0));
               } else {
                  oCurrModel.notes+="Syntax error in notin settings->"+vNextWord+sInCodeInTxt;
                  console.log("Syntax error in ->"+sInCodeInTxt)
               }
               break;
            case "rule":
               //console.log("Rule ->");
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               if(bRestrictions) {
                  oCurrRule=JSON.parse('{"rule":""}');//create rule object
                  //Add rule to the current requirement object.
                  if(typeof oCurrReq.rules==='undefined') oCurrReq.rules=[];
                  oCurrReq.rules.push(oCurrRule);
                  var aCheckStack=[],bNotYet=true;
                  var aCheckStack2=[],bAllowlfcr=false;
                  oCurrRule.rule=vNextWord;
                  do {
                     if((sInCodeInTxt.charAt(0)).match(/\)/)) {
                        if(aCheckStack2.length>0) {
                           aCheckStack2.pop();
                           oCurrRule.rule+=sInCodeInTxt.charAt(0);
                           if(aCheckStack2.length==0) bAllowlfcr=false;
                        } else {
                           bAllowlfcr=false;
                        }
                     } else if((sInCodeInTxt.charAt(0)).match(/(\})/)) {
                        if(aCheckStack.length>0) {
                           aCheckStack.pop();
                           oCurrRule.rule+=sInCodeInTxt.charAt(0);
                        } else {
                           bNotYet=false;
                        }
                     } else {
                        oCurrRule.rule+=sInCodeInTxt.charAt(0);
                     }
                     if((sInCodeInTxt.charAt(0)).match(/(\{)/)) {
                        aCheckStack.push("{");
                     }
                     if((sInCodeInTxt.charAt(0)).match(/\(/)) {
                        aCheckStack2.push("(");
                        bAllowlfcr=true;
                     }
                     if(bNotYet) sInCodeInTxt=sInCodeInTxt.substr(1);
                  } while((!((sInCodeInTxt.charAt(0)).match(/(\n)|(\r)/)&&(!bAllowlfcr)))&&(sInCodeInTxt.length>0)&&(bNotYet));
                  //console.log(" '"+oCurrRule.rule+"'");
                  bSkipNext=false;
               } else {
                  oCurrModel.notes+="Syntax error in rule settings->"+vNextWord+sInCodeInTxt;
                  console.log("Syntax error in -> "+sInCodeInTxt);
               }
               break;
            case "pci":
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrModel.notes+="Set PCI '"+vNextWord+"'\n";
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //Get possible rule
               var sRule="";
               if(vNextWord.match(/\=/)) {
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                  do {
                     sRule+=vNextWord+" ";
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                  } while((sInCodeInTxt!="")&&("[var][si][pihw][pisw]".indexOf("["+vNextWord+"]")<0));
                  if(typeof oCurrReq.rules==='undefined') oCurrReq.rules=[];
                  oCurrReq.rules.push({"qty_rule":sRule});
                  bSkipNext=true;
                  oCurrModel.notes+="->Precondition rule '"+sRule+"':\n";
               }
               break;
            case "si":
               oCurrObject=JSON.parse('{"name":"","SI":"","SINAME":"","PCI":"","services":[]}');//create object
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrObject.SI=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
               oCurrObject.services.push({"service":oCurrObject.SI});
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               if("[[][ ][\n][\r]".indexOf("["+vNextWord+"]")<0) {
                  oCurrObject.name=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                  oCurrObject.SINAME=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                  oCurrObject.description=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
                  oCurrModel.objects.push(oCurrObject);
                  oCurrModel.notes+="Create si object code:'"+oCurrObject.SI+"' name:'"+oCurrObject.name+"'\n";
               } else {//Only sicode given?
                  oCurrObject.name=oCurrObject.SI;
                  oCurrObject.SINAME=oCurrObject.SI;
                  oCurrObject.description=oCurrObject.SI;
                  oCurrModel.objects.push(oCurrObject);
                  oCurrModel.notes+="Create si object code:'"+oCurrObject.SI+"' name:'"+oCurrObject.SI+"'\n";
                  bSkipNext=true;
               }
               break;
            case "["://Get attributes to the current object
               //Remove space(s) tabs and return(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
               do {
                  switch(vNextWord) {
                     case "sap":
                        var sAttrName=vNextWord;
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        oCurrObject[sAttrName]=vNextWord;
                        break;
                     case "pci":
                        var sAttrName=vNextWord;
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        oCurrObject["PCI"]=vNextWord;
                        break;
                     case "layout":
                        var sAttrName=vNextWord;
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        oCurrObject[sAttrName]=vNextWord;
                        break;
                     case "statementsPerProcedure":
                        var sAttrName=vNextWord;
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        oCurrObject[sAttrName]=vNextWord;
                        break;
                     case "characteristicsPerClass":
                        var sAttrName=vNextWord;
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        oCurrObject[sAttrName]=vNextWord;
                        break;
                     default: //Other attributes are added as name=true values
                     var sAttrName=vNextWord;
                     oCurrObject[sAttrName]=true;
                  }
                  //Remove space(s) tabs and return(s)
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
               } while((vNextWord!="]")&&(sInCodeInTxt.length>0));
               break;
            case "options":
               break;
            case "domain":
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               oCurrModel.notes+="Domain '"+vNextWord+"':\n";
               var sDomainName=vNextWord;
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //get =
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               //Get name and content->replace data from string   name="{..}""
               var sDomain=vNextWord;
               var aCheckStack=[];
               var bNotYet=true;
               do {
                  if((sInCodeInTxt.charAt(0)).match(/(\})/)) {
                     if(aCheckStack.length>0) {
                        aCheckStack.pop();
                        sDomain+=sInCodeInTxt.charAt(0);
                     } else {
                        bNotYet=false;
                        sDomain+=sInCodeInTxt.charAt(0);
                     }
                  } else {
                     sDomain+=sInCodeInTxt.charAt(0);
                  }
                  if((sInCodeInTxt.charAt(0)).match(/(\{)/)) {
                     aCheckStack.push("{");
                  }
                  sInCodeInTxt=sInCodeInTxt.substr(1);
               } while((sInCodeInTxt.length>0)&&(bNotYet));
               bSkipNext=false;
               oCurrModel.notes+=" content: '"+sDomain+"'\n";
               while(sInCodeInTxt.indexOf(sDomainName)>0) {
                  sInCodeInTxt=sInCodeInTxt.replace(sDomainName,sDomain);
               }
               break;
            case " ":
               break;
            case "\t":
               break;
            case "\r":
               break;
            case "\n":
               break;
            case "{":
               break;
            case "}":
               bRule=false;
               bRestrictions=false;
               break;
            default:
               var nTLength=32;if(sInCodeInTxt.length<nTLength) nTLength=sInCodeInTxt.length;
               oCurrModel.notes+="\n\n\n********************************\nSyntax error in -> ..'"+vNextWord+(sInCodeInTxt.substring(0,nTLength)).replace(/\r/gmi,'').replace(/\n/gmi,'').replace(/\t/gmi,'')+"'..";
               return(oResultObject);
         }//switch
      } while(((nLoopBreak--)>0)&&((sInCodeInTxt.length>0)));
      if(nLoopBreak<0) console.log("Loop break-> Something went wrong????");
   } catch(e) {
      console.log("??"+e.message);
   }
   return(oResultObject);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doGetStatement(sInSourceTxt) {//Keep all spaces and return codes
   var sStatement="";
   var sSyntaxError="";
   var aCheckStack=[];
   var bNotYet=true;
   var bAllowlfcr=false;
   var sTmpChr="";
   var sInCodeTxt=sInSourceTxt;
   var bStatementEnd=false;
   var bEmptyLine=false;
   do {
      bEmptyLine=false;
      if((sInCodeTxt.charAt(0)||"").match(/(\n)|(\r)/)) bEmptyLine=true;
      if((sInCodeTxt.charAt(0)||"").match(/(\t)/)&&(bEmptyLine)) bEmptyLine=true;
      if((sInCodeTxt.charAt(0)||"")=="/") {
         if((sInCodeTxt.charAt(1)||"")=="/") {//Remove line
            sInCodeTxt=sInCodeTxt.substr(2);
            do {
               sInCodeTxt=sInCodeTxt.substr(1);
            } while(!((sInCodeTxt.charAt(0)||"").match(/(\n)|(\r)/))&&(sInCodeTxt!=""));
         } else if((sInCodeTxt.charAt(1)||"")=="*") {//Remove line
            sInCodeTxt=sInCodeTxt.substr(2);
            do {
               sInCodeTxt=sInCodeTxt.substr(1);
            } while(!(((sInCodeTxt.charAt(0)||"")=="*")&&((sInCodeTxt.charAt(1)||"")=="/"))&&(sInCodeTxt!=""));
            sInCodeTxt=sInCodeTxt.substr(2);
         }
      }
      if((sInCodeTxt.charAt(0)).match(/\)/)) {
         if(aCheckStack.length>0) {
            sTmpChr=aCheckStack.pop();
            if(sTmpChr!="(") sSyntaxError+="\n\n\n\n***************Syntax error**************\n\n')' expexted? "+sGetExampleCode(sInCodeTxt)+"\n\n";
         } else {
            sSyntaxError+="\n\n\n\n***************Syntax error**************\n\n')' expexted? "+sGetExampleCode(sInCodeTxt)+"\n\n";
         }
      } else if((sInCodeTxt.charAt(0)).match(/(\})/)) {
         if(aCheckStack.length>0) {
            sTmpChr=aCheckStack.pop();
            if(sTmpChr!="{") sSyntaxError+="\n\n\n\n***************Syntax error**************\n\n'}' expexted? "+sGetExampleCode(sInCodeTxt)+"\n\n";
         } else {
            sSyntaxError+="\n\n\n\n***************Syntax error**************\n\n'}' expexted? "+sGetExampleCode(sInCodeTxt)+"\n\n";
         }
      } else if((sInCodeTxt.charAt(0)).match(/(\{)/)) {
         aCheckStack.push("{");
         bAllowlfcr=true;
      } else if((sInCodeTxt.charAt(0)).match(/\(/)) {
         aCheckStack.push("(");
         bAllowlfcr=true;
      }
      sStatement+=sInCodeTxt.charAt(0);
      sInCodeTxt=sInCodeTxt.substr(1);
      if(aCheckStack.length==0) {
         bAllowlfcr=false;
         //Reserver words:
         if(sInCodeTxt.indexOf("si ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("pci ")==0){bStatementEnd=true;}
         else if((sInCodeTxt.indexOf("#")==0)&&(bEmptyLine)){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("tab ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("options ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("domain ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("piproduct ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("pisw ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("piservice ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("pihw ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("var ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("param ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("restrictions ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("rule ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("SI ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("PCI ")==0){bStatementEnd=true;}
         else if(sInCodeTxt.indexOf("check ")==0){bStatementEnd=true;}
      }
   } while((!(bStatementEnd))&&(sInCodeTxt.length>0));
   return([sStatement,sInCodeTxt,sSyntaxError])
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doGetTreeUsingA1toIDInHTMLList(nDepth,sInAttributeToCompare,sInCompareAttributeforId,oInConfigurationObjects) {
   var retHTML="";
   for(var x=0;x<(oInConfigurationObjects||[]).length;x++) {
      var ocurrent=oInConfigurationObjects[x];
      if(ocurrent[sInAttributeToCompare]==sInCompareAttributeforId) {
        retHTML+="<li><a href='#' onclick='doEditSolutionComponent(\""+ocurrent.id+"\")'>"+"+".repeat(nDepth||0)+" "+ocurrent.name+"</a></li>";
        retHTML+=doGetTreeUsingA1toIDInHTMLList(nDepth+1,sInAttributeToCompare,ocurrent.id,oInConfigurationObjects);
      }
   }
   return(retHTML);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doUpdateModelObjectList() {
   var sNamelist="",sDublicateName="";
   var sChilds="",bNoInheritance=true;
   var sAlreadyH="";
   var nRequirements=0;
   var nServices=0;
   var nObjects=(oGActiveModel.objects.length||0);
   $("#myModelObjectList").html("<ol></ol>");
   var sFilter="";
   try {
      sFilter=$("#myModelObjectListFilter").val();
   } catch(fail) {
      sFilter="";
   }
   for(var x in oGActiveModel.objects) {
      nServices+=((oGActiveModel.objects[x].services||[]).length||0);
      nRequirements+=((oGActiveModel.objects[x].requirements||[]).length||0);
      if(sNamelist.indexOf("["+(oGActiveModel.objects[x]||{name:"no name found?"}).name+"]")>=0) sDublicateName=(oGActiveModel.objects[x]||{name:"no name found?"}).name;
      if(sFilter!="") {
         if(sFilter=="[id]") {
            $("#myModelObjectList ol").append("<li><a href='#' >"+oGActiveModel.objects[x].id+"</a></li>");
         } else if(sFilter=="#t") {
            //Show treeview
            if(typeof oGActiveModel.objects[x].extends==='undefined') {
               $("#myModelObjectList ol").append("<li id='"+(oGActiveModel.objects[x].name).replace(/\ /gmi,"_")+"'><a href='#' onclick='doEditModelComponent(\""+oGActiveModel.objects[x].name+"\")'>"+oGActiveModel.objects[x].name+"</a></li>");
               sChilds+="["+oGActiveModel.objects[x].name+"]";
              bNoInheritance=false;
            }
         } else {
            if(((oGActiveModel.objects[x].sheet_name||"")!="")&&(sFilter=="#g")) {
               if(sAlreadyH.indexOf("["+oGActiveModel.objects[x].sheet_name+"]")<0) {
                  $("#myModelObjectList").append('<a title="Click to expand or collapse." data-toggle="collapse" href="#'+oGActiveModel.objects[x].sheet_name+'" class="list-group-item list-group-item-info">'+oGActiveModel.objects[x].sheet_name+'</a><div id="'+oGActiveModel.objects[x].sheet_name+'" class="panel-collapse collapse"><ol></ol></div>');
                  sAlreadyH+="["+oGActiveModel.objects[x].sheet_name+"]";
               }
               $("#"+oGActiveModel.objects[x].sheet_name+" ol").append("<li><a href='#' onclick='doEditModelComponent(\""+oGActiveModel.objects[x].name+"\")'>"+oGActiveModel.objects[x].name+"</a></li>");
            } else {
               if(((JSON.stringify(oGActiveModel.objects[x]||{})).toUpperCase()).indexOf(sFilter.toUpperCase())>=0) $("#myModelObjectList ol").append("<li><a href='#' onclick='doEditModelComponent(\""+oGActiveModel.objects[x].name+"\")'>"+oGActiveModel.objects[x].name+"</a></li>");
            }
         }
      } else {
         $("#myModelObjectList ol").append("<li><a href='#' onclick='doEditModelComponent(\""+oGActiveModel.objects[x].name+"\")'>"+oGActiveModel.objects[x].name+"</a></li>");
      }
      sNamelist+="["+(oGActiveModel.objects[x]||{name:"no name found?"}).name+"]";
   }
   if(sDublicateName!="") {
      $("#panelObjectId").attr("title","Warning: Two or more objects with the same name '"+sDublicateName+"' found!!! The changes are updated into the first found object!!\n\nObjects: "+nObjects+"\nRequirements: "+nRequirements+"\nServices: "+nServices);
      $("#panelObjectId").attr("class","panel panel-warning");
   } else {
      $("#panelObjectId").attr("title","Objects: "+nObjects+"\nRequirements: "+nRequirements+"\nServices: "+nServices);
      $("#panelObjectId").attr("class","panel panel-success");
   }
   if((oGActiveModel.objects||{length:0}).length>0) {
      $("#configurecommand").show();
      $("#changerolecommand").show();
   } else {
      $("#configurecommand").hide();
   }
}
//------------------------------------------------------------------
//-- Saves solution object in vue.js store , allows to show then in different structures
function getSolutionObjectList(resp) {
   $nuxt.$bus.$emit('webWorker-vue_update-solution-object-list', {
      solution: oGActiveSolution,
      cfg: resp
   });
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doUpdateSolutionObjectList(xConf) {
   if(typeof xConf === 'undefined') {
      xConf=getConfigByID(sGSelectedConfigurationID);
   }
   var xConf2=xConf;
   if(typeof xConf2.data ==='undefined') {
      xConf2.data={};
   }
   if(typeof xConf2.data.solution ==='undefined') {
      xConf2.data.solution={};
   }
   if(typeof xConf2.objects !=='undefined') {
      xConf2.data.solution=xConf;
   }
   $("#SolutionObjectsInOrder ol").html("");
   var sFilter="";
   try {
      sFilter=$("#SolutionObjectsInOrderFilter").val();
   } catch(fail) {
      sFilter="";
   }
   if(typeof sFilter==='undefined') sFilter="";
   if(typeof xConf2 !== 'undefined') {
      for(var x=0;x<(xConf2.data.solution.objects||[]).length;x++) {
         var ocurrent=xConf2.data.solution.objects[x];
         if(sFilter!="") {
            if(sFilter=="#d") {
               //Show differences
               //if(typeof aGPreviousSolutions[0]!=='undefined') {
               //   if(typeof aGPreviousSolutions[0].objects[x]==='undefined') {
               //      $("#SolutionObjectsInOrder ol").append("<li><a href='#' onclick='doEditSolutionComponent(\""+xConf2.data.solution.objects[x].id+"\")'>New object:"+xConf2.data.solution.objects[x].name+"</a></li>");
               //   } else {
               //      if(((JSON.stringify(xConf2.data.solution.objects[x]||{})).toUpperCase()).indexOf((JSON.stringify(aGPreviousSolutions[0].objects[x]||{})).toUpperCase())>=0) $("#SolutionObjectsInOrder ol").append("<li><a href='#' onclick='doEditSolutionComponent(\""+xConf2.data.solution.objects[x].id+"\")'>"+xConf2.data.solution.objects[x].name+"</a></li>");
               //   }
               //}
            } else if(sFilter=="#t") {
               //Show treeview
               if(typeof ocurrent.parentid==='undefined') {
                  $("#SolutionObjectsInOrder ol").append("<li><a href='#' onclick='doEditSolutionComponent(\""+ocurrent.id+"\")'>"+ocurrent.name+"</a></li>");
                  $("#SolutionObjectsInOrder ol").append(doGetTreeUsingA1toIDInHTMLList(1,"parentid",ocurrent.id,xConf2.data.solution.objects));
               }
            } else if(sFilter=="#c") {
               //Show creator relations using treeview
               if(typeof ocurrent.creatorid==='undefined') {
                  $("#SolutionObjectsInOrder ol").append("<li><a href='#' onclick='doEditSolutionComponent(\""+ocurrent.id+"\")'>"+ocurrent.name+"</a></li>");
                  $("#SolutionObjectsInOrder ol").append(doGetTreeUsingA1toIDInHTMLList(1,"creatorid",ocurrent.id,xConf2.data.solution.objects));
               }
            } else {
               if(((JSON.stringify(ocurrent||{})).toUpperCase()).indexOf(sFilter.toUpperCase())>=0) $("#SolutionObjectsInOrder ol").append("<li><a href='#' onclick='doEditSolutionComponent(\""+ocurrent.id+"\")'>"+ocurrent.name+"</a></li>");
            }
         } else {
            $("#SolutionObjectsInOrder ol").append("<li><a href='#' onclick='doEditSolutionComponent(\""+ocurrent.id+"\")'>"+ocurrent.name+"</a></li>");
         }
      }
      if(sFilter=="#d") {
         //Show differences
         if(typeof aGPreviousSolutions[0]!=='undefined') {
            if((aGPreviousSolutions[0].objects||[]).length>=(xConf2.data.solution.objects||[]).length) {
               for(var x=0;x<(xConf2.data.solution.objects||[]).length;x++) {
                  if((aGPreviousSolutions[0].objects[x].name||[])!=(xConf2.data.solution.objects[x].name||[])) {
                     $("#SolutionObjectsInOrder ol").append("<li><a href='#'>Changed from: "+aGPreviousSolutions[0].objects[x].name+" to "+xConf2.data.solution.objects[x].name+"</a></li>");
                  } else {
                     $("#SolutionObjectsInOrder ol").append("<li><a href='#'>"+aGPreviousSolutions[0].objects[x].name+"</a></li>");
                  }
               }
               for(var x=(xConf2.data.solution.objects||[]).length;x<(aGPreviousSolutions[0].objects||[]).length;x++) {
                  $("#SolutionObjectsInOrder ol").append("<li><a href='#'>Removed: "+aGPreviousSolutions[0].objects[x].name+"</a></li>");
               }
            } else {
               for(var x=0;x<(aGPreviousSolutions[0].objects||[]).length;x++) {
                  if((aGPreviousSolutions[0].objects[x].name||[])!=(xConf2.data.solution.objects[x].name||[])) {
                     $("#SolutionObjectsInOrder ol").append("<li><a href='#'>Changed from: "+xConf2.data.solution.objects[x].name+" to "+aGPreviousSolutions[0].objects[x].name+"</a></li>");
                  } else {
                     $("#SolutionObjectsInOrder ol").append("<li><a href='#'>"+aGPreviousSolutions[0].objects[x].name+"</a></li>");
                  }
               }
               for(var x=(aGPreviousSolutions[0].objects||[]).length;x<(xConf2.data.solution.objects||[]).length;x++) {
                  $("#SolutionObjectsInOrder ol").append("<li><a href='#'>Added: "+xConf2.data.solution.objects[x].name+"</a></li>");
               }
            }
         } else {
            for(var x=0;x<(xConf2.data.solution.objects||[]).length;x++) {
               $("#SolutionObjectsInOrder ol").append("<li><a href='#'>Added: "+xConf2.data.solution.objects[x].name+"</a></li>");
            }
         }
      }
   }
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doInheritance4(oInObject) {
   try {
      for(var x in oInObject.extends) {
         var oOriginalObject=JSON.parse(JSON.stringify(oInObject));
         var oInheritThis=lGModelObjectsByName[oInObject.extends[x]];
         if(typeof oInheritThis.extends!=='undefined') doInheritance4(oInheritThis);
         for(var xx in oInheritThis) {
            switch(xx) {
               case "requirements":
                     if(typeof oInObject[xx]==='undefined') {
                        oInObject[xx]=oInheritThis[xx];
                     } else {
                        for(var yy=0;yy<oInheritThis[xx].length;yy++) {
                           var bSfounded=false;
                           for(var zz=0;zz<oOriginalObject[xx].length;zz++) {
                              if((oInheritThis[xx][yy].requirement||"not found")==(oOriginalObject[xx][zz].requirement||"not found")) {
                                 bSfounded=true;
                              }
                           }
                           if(!bSfounded) {
                              oInObject[xx].push(JSON.parse(JSON.stringify(oInheritThis[xx][yy])));
                           }
                        }
                     }
                     break;
               case "components":
                     if(typeof oInObject[xx]==='undefined') {
                        oInObject[xx]=oInheritThis[xx];
                     } else {
                        for(var yy=0;yy<oInheritThis[xx].length;yy++) {
                           var bSfounded=false;
                           for(var zz=0;zz<oOriginalObject[xx].length;zz++) {
                              if((oInheritThis[xx][yy].name||"not found")==(oOriginalObject[xx][zz].name||"not found")) {
                                 bSfounded=true;
                              }
                           }
                           if(!bSfounded) {
                              oInObject[xx].push(JSON.parse(JSON.stringify(oInheritThis[xx][yy])));
                           }
                        }
                     }
                     break;
               case "services":
                     if(typeof oInObject[xx]==='undefined') {
                        oInObject[xx]=oInheritThis[xx];
                     } else {
                        for(var yy=0;yy<oInheritThis[xx].length;yy++) {
                           var bSfounded=false;
                           for(var zz=0;zz<oOriginalObject[xx].length;zz++) {
                              if((oInheritThis[xx][yy].service||"not found")==(oOriginalObject[xx][zz].service||"not found")) {
                                 bSfounded=true;
                              }
                           }
                           if(!bSfounded) {
                              oInObject[xx].push(JSON.parse(JSON.stringify(oInheritThis[xx][yy])));
                           }
                        }
                     }
                     break;
               case "extends":
                     break;
               default:
                  if(typeof oInObject[xx]==='undefined') {
                     oInObject[xx]=oInheritThis[xx];
                  }
            }
         }

      }
   } catch(eionnaa) {

   }
}
//---------------------------------------------------------------------------------------------
function doCreateNewSolutionId() {
   return ("S"+("1234567891"+((new Date()).getTime()).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(nGSC++).toString()).substr(-11,11))
}
//---------------------------------------------------------------------------------------------
function doAddNewSolutionObject() {
  return(doSelectSolution(doConfigure(doCreateNewSolutionId())));
}
//--------------------------------------------------------------------------------------------------------------------------------------------
function getConfigByID(sInConfigId) {
   for(var x in oGSolutions) {
      if(oGSolutions[x].ZCONFIG_ID==sInConfigId) {
         return({"data":{"ZCONFIG_ID":sInConfigId,"solution":oGSolutions[x],"templates":oGTemplates}});
      }
   }
   return({"data":{"ZCONFIG_ID":sInConfigId,"solution":{}}});
}
//---------------------------------------------------------------------------------------------
function doCopyConfiguration(sInSolutionId) {
   var xConfCopyThis = getConfigByID(sInSolutionId);
   var sCopy = JSON.stringify(xConfCopyThis.data.solution);
   var xConfCopy = JSON.parse(sCopy);
   xConfCopy["-ZNAME"] = "Copy of " + (xConfCopyThis.data.solution.name||"Solution");
   xConfCopy.name="Copy of " + (xConfCopyThis.data.solution.name||"Solution");
	xConfCopy["-ZFLUID"] =  "";
   xConfCopy["-ZSACTION"] = "";
   xConfCopy["ZCONFIG_ID"]=doCreateNewSolutionId();
   xConfCopy["ZCONFIG_ID"]=xConfCopy["ZCONFIG_ID"];
   xConfCopy.name=xConfCopy["-ZNAME"];
   xConfCopy["-ZID"] = xConfCopy["ZCONFIG_ID"];
   for(var n=0;n<(xConfCopy.objects||[]).length;n++){
      if(typeof xConfCopy.objects[n].AT!=='undefined') xConfCopy.objects[n].AT="";
      if(xConfCopy.objects[n].type=="Product") {
         if(typeof xConfCopy.objects[n].AT!=='undefined') xConfCopy.objects[n].AT="AT"+(((new Date()).getTime()).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()).toString().substr(-11,11);
      }
   }
   oGSolutions.push(xConfCopy);
   doUpdateSolutionList();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doSelectSolution(sInSolutionId) {
   bGShowNetworkView=false;
   bGTestMode=false,oSelectedSolution={};
   sGSelectedConfigurationID=sInSolutionId;
   for(var noniin in oGSolutions) {
      if(oGSolutions[noniin].ZCONFIG_ID==sInSolutionId) {
         oSelectedSolution=oGSolutions[noniin];
         sGSelectedConfigurationID=sInSolutionId;
         oGActiveSolution=oGSolutions[noniin];
         doConfigure(sGSelectedConfigurationID);
      }
   }
   return(oSelectedSolution);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doConfigure(sInObjectId) {
   //xConf->oGActiveSolution:
   //xConf.data.ZMODEL_VAL_ID
   //xConf.data.ZMODEL_VAL_NAME
   //xConf.data.solution
   //Validator->oGActiveModel
   nGAssetFileIndex=0;
   nGAssetFileIndexNeeded=0;
   var xConf = getConfigByID(sInObjectId);
   if(xConf != null) {
      //Configuration exist
      try {
         if(typeof(Worker) !== "undefined") {
            if (typeof(oWebWorkers[sInObjectId]) == "undefined") {
               doStartWorker(sInObjectId);
            }
            if(typeof(oWebWorkers[sInObjectId]) != "undefined") {
               _VALIDATOR = JSON.parse(JSON.stringify(oGActiveModel));
               xConf.data.solution.ZCONFIG_ID = sInObjectId;
               xConf.data.ZCONFIG_ID = sInObjectId;
               xConf.data.ZMODEL_VAL_ID = (oGActiveModel.modified||"Offline tool");
               xConf.data.ZMODEL_VAL_NAME = (oGActiveModel.name||"Test");
               xConf.data.solution.name = (oGActiveSolution.name||"Test");
               xConf.data.ZMODEL_USER_ROLE=(sGRole||"Normal user");
               if(bGTestMode||bGEditMode) xConf.data.reconfigure=true;
               var webWorkerData = { xConf: xConf, validator: _VALIDATOR };
               oWebWorkers[sInObjectId].postMessage(JSON.stringify(webWorkerData));
            }
         }
      } catch(e) {
         console.log(e.message);
      }
   }
   $("#createbillofquantitycommand").show();
   $("#showgroup").show();
   $("#solutiongroup").show();
   $("#settingsgroup").show();
   $("#showclear").show();
   $("#showexport").show();
   $("#changeenginecommand").show();
   return(sInObjectId);
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------
function getInheritanceDepth(nInDepth,oInObject) {
   var nDepth=nInDepth;
   if(!oInObject.uml) oInObject.uml={depth:nInDepth,x:0,y:0};
   if(oInObject.uml.depth<nInDepth) {
      oInObject.uml.depth=nInDepth;
   }
   try {
      for(var x in oInObject.extends) {
         nDepth=getInheritanceDepth(nInDepth+1,lGModelObjectsByName[oInObject.extends[x]]);
      }
   } catch(eionnaa) {}
   return(nDepth);
}
//----------------------------------------------------------------------------------------------------------------
function showModelHierarchy(oInModel) {
   var sHTML="",nMaxDepth=1,nMaxHeight=500,nNextxInLevel={};
   if(typeof oInModel==='undefined') oInModel=oGActiveModel;
   for(var i=0;i<(oInModel.objects||[]).length;i++) {
      var ncurrdepth=getInheritanceDepth(1,oInModel.objects[i]);
      if(ncurrdepth>nMaxDepth) nMaxDepth=ncurrdepth;
   }
   if(nMaxHeight<(nMaxDepth*150)) nMaxHeight=(nMaxDepth*150);
   sHTML='<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="'+nMaxHeight+'px">';
   for(var i=0;i<(oInModel.objects||[]).length;i++) {
      var x=i*10,y=0;
      if(oInModel.objects[i].uml) {
         if(oInModel.objects[i].uml.depth) y=150*(oInModel.objects[i].uml.depth-1);
         if(typeof nNextxInLevel["L"+oInModel.objects[i].uml.depth]==='undefined') {
            x=1;
            if(oInModel.objects[i].uml.depth!=1) {
               nNextxInLevel["L"+oInModel.objects[i].uml.depth]={x:110};
            } else {
               nNextxInLevel["L"+oInModel.objects[i].uml.depth]={x:10};
            }
         } else {
            x=nNextxInLevel["L"+oInModel.objects[i].uml.depth].x;
            if(oInModel.objects[i].uml.depth!=1) {
               nNextxInLevel["L"+oInModel.objects[i].uml.depth].x+=110;
            } else {
               nNextxInLevel["L"+oInModel.objects[i].uml.depth].x+=10;
            }
         }
         oInModel.objects[i].uml.x=x;
         oInModel.objects[i].uml.y=y;
      }
      sHTML+='<rect x="'+(x)+'" y="'+((nMaxHeight-150)-y)+'" width="100" height="100" style="fill:#FFFFAA;stroke-width:1;stroke:#FF3366">';
      sHTML+= '<title>'+(oInModel.objects[i].name||"")+'</title>';
      sHTML+='</rect>';
      //sHTML+='<text onclick="doEditModelComponent(\"'+(oInModel.objects[i].name||"")+'\");" x="'+(i*10+5)+'" y="'+(415)+'">'+(oInModel.objects[i].name||"")+'</text>';
      sHTML+='<text x="'+(x+5)+'" y="'+((nMaxHeight-150)-(y-15))+'">'+(oInModel.objects[i].name||"")+'</text>';
   }
   //Draw lines
   for(var i=0;i<(oInModel.objects||[]).length;i++) {
      for(var x=0;x<(oInModel.objects[i].extends||[]).length;x++) {
         var targetObject=lGModelObjectsByName[oInModel.objects[i].extends[x]];
         if(targetObject.uml) {
            if(typeof targetObject.uml.x!=='undefined') {
               var x1=targetObject.uml.x;
               if(typeof targetObject.uml.y!=='undefined') {
                  var y1=targetObject.uml.y;
                  if(oInModel.objects[i].uml) {
                     if(typeof oInModel.objects[i].uml.x!=='undefined') {
                        var x2=oInModel.objects[i].uml.x;
                        if(typeof oInModel.objects[i].uml.y!=='undefined') {
                           var y2=oInModel.objects[i].uml.y;
                           sHTML+="<line x1='"+(x1+50)+"' y1='"+(((nMaxHeight-150)-(y1))+100)+"' x2='"+(x2+50)+"' y2='"+((nMaxHeight-150)-(y2))+"' style='stroke:rgb(255,0,0);stroke-width:2'/>";
                        }
                     }
                  }
               }
            }
         }
      }
   }
   sHTML+='</svg>';
   $("#content").html(sHTML);
}
//----------------------------------------------------------------------------------------------------------------
function doGetCableSheet(oInSolution){
   var aCableSheetList=[],nline_nbr=1;
   //Generate Cable labeling sheet for testing.
   for(var nIndex=0;nIndex<oInSolution.objects.length;nIndex++) {
      var oCObject=oInSolution.objects[nIndex];
      if(typeof oCObject.cableLabelDataList!=='undefined') {
         for(var nIndex2=0;nIndex2<oCObject.cableLabelDataList.length;nIndex2++) {
            var oListObject=JSON.parse(JSON.stringify(oCObject.cableLabelDataList[nIndex2]));
            if(typeof oListObject.line_nbr !== 'undefined') {
               aCableSheetList.push(JSON.parse(JSON.stringify(oListObject)));
            } else {
               oListObject.line_nbr=nline_nbr++;
               aCableSheetList.push(JSON.parse(JSON.stringify(oListObject)));
            }
         }
      } else {
         if((oCObject.type||"").toUpperCase()=="CABLE") {
            var oListObject= {
               "line_nbr":"",
               "item_level":"",
               "material_code":"",
               "component_code":"",
               "component_code_revision":"",
               "short_name":"",
               "product_name":"",
               "G":"",
               "H":"",
               "I":"",
               "J":"",
               "K":"",
               "L":"",
               "M":"",
               "N":"",
               "O":"",
               "1st_end_cable_label":"",
               "2nd_end_cable_label":"",
               "manufacturer":"",
               "model":"",
               "manufacturere_part_number_qpn":"",
               "serial_number":"",
               "cable_lenght_dm":"",
               "cable_lenght_mm":"",
               "unit":"",
               "sub_unit":"",
               "left_right":""
            };
            var sListObjectTemplate=JSON.stringify(oListObject);
            oListObject.line_nbr=nline_nbr++;
            oListObject.item_level=(oCObject.level||"");
            oListObject.material_code=(oCObject.SI||"");
            oListObject.component_code=(oCObject.code||"");
            oListObject.component_code_revision=(oCObject.coderevision||"");
            oListObject.short_name=(oCObject.short||"");
            oListObject.product_name=(oCObject.SINAME||"");
            //G
            var oFirstEnd={};
            var oSecondEnds=[];
            for(var jk=0;jk<(oCObject.requirements||[]).length;jk++){
               if((oCObject.requirements[jk].description||"")=="1st end") {
                  oFirstEnd=oCObject.requirements[jk];
               }
               if((oCObject.requirements[jk].description||"")=="2nd end") {
                  oSecondEnds.push(JSON.parse(JSON.stringify(oCObject.requirements[jk])));
               }
            }
            if((oFirstEnd.description||"")=="1st end") {
               oListObject["G"]=doGetUlocation(oFirstEnd);
               if(oListObject["G"]!=""){
                  oListObject["I"]=doGetPort(oFirstEnd);
                  if(oListObject["I"]!=""){
                     oListObject["H"]=":";
                  }
               }
               for(var njes=0;njes<oSecondEnds.length;njes++){
                  if((oSecondEnds[njes].description||"")=="2nd end") {
                     oListObject.line_nbr=nline_nbr++;
                     oListObject["G"]=doGetUlocation(oSecondEnds[njes]);
                     if(oListObject["G"]!=""){
                        oListObject["I"]=doGetPort(oSecondEnds[njes]);
                        if(oListObject["I"]!=""){
                           oListObject["H"]=":";
                        }
                     }
                     aCableSheetList.push(JSON.parse(JSON.stringify(oListObject)));
                     oListObject=JSON.parse(sListObjectTemplate);
                  }
               }
            }
            /*
            for(var jk=0;jk<(oCObject.services||[]).length;jk++){
               if((oCObject.services[jk].description||"")=="1st end") {
                  oListObject["G"]=doGetUlocation(oCObject.services[jk]);
                  aCableSheetList.push(JSON.parse(JSON.stringify(oListObject)));
               }
            }
            for(var jk=0;jk<(oCObject.requirements||[]).length;jk++){
               if((oCObject.requirements[jk].description||"")=="2nd end") {
                  oListObject=JSON.parse(sListObjectTemplate);
                  oListObject.line_nbr=nline_nbr++;
                  oListObject["G"]=doGetUlocation(oCObject.requirements[jk]);
                  if(oListObject["G"]!=""){
                     oListObject["I"]=doGetPort(oCObject.requirements[jk]);
                     if(oListObject["I"]!=""){
                        oListObject["H"]=":";
                     }
                  }
                  aCableSheetList.push(JSON.parse(JSON.stringify(oListObject)));
               }
            }
            for(var jk=0;jk<(oCObject.services||[]).length;jk++){
               if((oCObject.services[jk].description||"")=="2nd end") {
                  oListObject=JSON.parse(sListObjectTemplate);
                  oListObject.line_nbr=nline_nbr++;
                  oListObject["G"]=doGetUlocation(oCObject.services[jk]);
                  aCableSheetList.push(JSON.parse(JSON.stringify(oListObject)));
               }
            }
            */
            //oListObject["1st_end_cable_label"]="";
            //oListObject["2nd_end_cable_label"]="";
         }//Cable
      }
   }
   aCableSheetList.sort(function(a, b){return a.line_nbr - b.line_nbr});
   return(aCableSheetList);
}
//----------------------------------------------------------------------------------------------------------------
function doGetPort(oInObject){
   var sPort="";
   try{
      if(typeof oInObject.service!=='undefined'){
         if(typeof oInObject.connectedTo!=='undefined'){
           //??sPort=doGetServiceObjectById(oInObject.connectedTo[0]).service||"";
         }
      } else if(typeof oInObject.requirement !== 'undefined') {
         if(typeof oInObject.connectedTo!=='undefined'){
            sPort=doGetServiceObjectById(oInObject.connectedTo[0]).service||"";
         } else if(typeof oInObject.requirement === 'string') {
            sPort=oInObject.requirement;
         }
      }
   } catch(errorii){}
   return(sPort);
}
//----------------------------------------------------------------------------------------------------------------
function doGetServiceObjectById(sInServiceID){
   var oServiceObject;
   if(lGObjectsBySerId[sInServiceID]){
      if(lGObjectsBySerId[sInServiceID].services){
         for(var i=0;i<lGObjectsBySerId[sInServiceID].services.length;i++){
            if(lGObjectsBySerId[sInServiceID].services[i].id==sInServiceID){
	            oServiceObject=lGObjectsBySerId[sInServiceID].services[i];
	            break;
	         }
         }
      }
   }else{
      try{
         for(var x=0;x<lGFreeServices.length;x++){
            if(lGFreeServices[x].id==sInServiceID){
               oServiceObject=lGFreeServices[x];
               break;
            }
         }
      }catch(e){}
   }
   if(typeof oServiceObject==='undefined'){//Get object
      loop55: for(var si=0;si<oGEditRR.objects.length;si++){
         if(typeof oGEditRR.objects[si].services!=='undefined'){
            for(var i=0;i<oGEditRR.objects[si].services.length;i++){
               if(oGEditRR.objects[si].services[i].id==sInServiceID){
	               oServiceObject=oGEditRR.objects[si].services[i];
	               break loop55;
	            }
            }
         }
      }
   }
   return(oServiceObject);
}
//----------------------------------------------------------------------------------------------------------------
function doGetUlocation(oInObject){
   var sUlocation="";
   try{
      if(typeof oInObject.location!=='undefined'){
         var nTmpY=parseInt(oInObject.location.y||-1);
         if(nTmpY>=0) sUlocation="U"+(1+Math.floor(nTmpY/44.45));
      }
   } catch(errori){}
   return(sUlocation);
}
//----------------------------------------------------------------------------------------------------------------
function doShowReturnObject() {
   var sObject=$("#sRetObject").val(),oObject={};
   var sHTML="",sHTMLH="",sHTMLB="";
   if(sObject!="") {
      oObject=JSON.parse(sObject);
   } else {
      oObject=oGActiveSolution;
      oObject.cable_labeling=doGetCableSheet(oGActiveSolution);
   }
   sHTML+='<ul class="nav nav-tabs">';
   sHTML+= '<li class="active"><a data-toggle="tab" href="#cover">Cover</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu1">Equipment BOM (IMPORT)</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu2">BTO Order items</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu3">BTO asset data 1</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menuFL">Face Layout</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu4">Node Configuration details</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu5">NADCM</a></li>';
   //sHTML+= '<li><a data-toggle="tab" href="#menu6">Selections</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu6">Cable labeling</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu7">Switch Power Connections</a></li>';
   sHTML+= '<li><a data-toggle="tab" href="#menu8">Configuration Data</a></li>';
   sHTML+='</ul>';
   sHTML+='<div class="tab-content">';
   sHTML+= '<div id="cover" class="tab-pane fade in active">';
   sHTML+=  '<h3>Cover</h3>';
   sHTML+=  '<p>Under development...</p>';
   //Document version:	Date	Handled by	Status	Approved by	"SI changes / ECO number "	Change history	Review findings	Order ID	Name	Description	Model version	Customer	In-app id
   sHTML+= '</div>';
   sHTML+= '<div id="menu1" class="tab-pane fade">';
   sHTML+=  '<h3>Equipment BOM (IMPORT)</h3>';
   sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
   var sTableContent="",bHeaderCreated=false,sHeaderRow="";
   for(var x=0;x<(oObject.equipment_bom||[]).length;x++) {
      sTableContent+="<tr>";
      for(var skey in oObject.equipment_bom[x]) {
         if(!bHeaderCreated) {
            sHeaderRow+="<th>"+(skey)+"</th>";
         }
         sTableContent+="<td>"+(oObject.equipment_bom[x][skey]||"-")+"</td>";
      }
      sTableContent+="</tr>";
      bHeaderCreated=true;
   }
   sHTML+="<tr>"+sHeaderRow+"</tr>";
   sHTML+=sTableContent;
   sHTML+=  "</table>";
   sHTML+= '</div>';
   //bto_order_items
   sHTML+= '<div id="menu2" class="tab-pane fade">';
   sHTML+=  '<h3>BTO Order items</h3>';
   sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
   sTableContent="",bHeaderCreated=false,sHeaderRow="";
   for(var x=0;x<(oObject.bto_order_items||[]).length;x++) {
      sTableContent+="<tr>";
      for(var skey in oObject.bto_order_items[x]) {
         if(!bHeaderCreated) {
            sHeaderRow+="<th>"+(skey)+"</th>";
         }
         sTableContent+="<td>"+(oObject.bto_order_items[x][skey]||"-")+"</td>";
      }
      sTableContent+="</tr>";
      bHeaderCreated=true;
   }
   sHTML+="<tr>"+sHeaderRow+"</tr>";
   sHTML+=sTableContent;
   sHTML+=  "</table>";
   sHTML+= '</div>';
   sHTML+= '<div id="menu3" class="tab-pane fade">';
   sHTML+=  '<h3>BTO asset data 1</h3>';
   sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
   sTableContent="",bHeaderCreated=false,sHeaderRow="";
   for(var x=0;x<(oObject.bto_asset_data||[]).length;x++) {
      sTableContent+="<tr>";
      for(var skey in oObject.bto_asset_data[x]) {
         if(!bHeaderCreated) {
            sHeaderRow+="<th>"+(skey)+"</th>";
         }
         if((skey=="configuration_id")&&((oObject.bto_asset_data[x][skey]||"-")!="-")){
            sTableContent+="<td title='"+(oObject.bto_asset_data[x][skey]||"-")+"'>...</td>";
         } else {
            sTableContent+="<td>"+(oObject.bto_asset_data[x][skey]||"-")+"</td>";
         }
      }
      sTableContent+="</tr>";
      bHeaderCreated=true;
   }
   sHTML+="<tr>"+sHeaderRow+"</tr>";
   sHTML+=sTableContent;
   sHTML+=  "</table>";
   sHTML+= '</div>';
   sHTML+= '<div id="menuFL" class="tab-pane fade">';
   sHTML+=  '<h3>Face Layout</h3>';
   sHTML+=$("#sRetFCObject").val();
   sHTML+= '</div>';
   sHTML+= '<div id="menu4" class="tab-pane fade">'
   sHTML+=  '<h3>Node configurations</h3>';
   for(var y=0;y<(oObject.nodes||[]).length;y++) {
      sHTML+=  "<p>"+oObject.nodes[y].parent.name+"</p>";
      sHTML+=  "<p>"+oObject.nodes[y].parent.description+"</p>";
      sHTML+=  "<p>"+oObject.nodes[y].parent.cid+"</p>";
      sHTML+=  "<p>"+oObject.nodes[y].parent.sid+"</p>";
      sHTML+=  "<p>"+oObject.nodes[y].parent.bareboneplatform+"</p>";
      sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
      sTableContent="",bHeaderCreated=false,sHeaderRow="";
      for(var x=0;x<(oObject.nodes[y].details||[]).length;x++) {
         sTableContent+="<tr>";
         for(var skey in oObject.nodes[y].details[x]) {
            if(!bHeaderCreated) {
               sHeaderRow+="<th>"+(skey)+"</th>";
            }
            sTableContent+="<td>"+(oObject.nodes[y].details[x][skey]||"-")+"</td>";
         }
         sTableContent+="</tr>";
         bHeaderCreated=true;
      }
      sHTML+="<tr>"+sHeaderRow+"</tr>";
      sHTML+=sTableContent;
      sHTML+=  "</table>";
   }
   sHTML+= '</div>';
   sHTML+= '<div id="menu5" class="tab-pane fade">'
   sHTML+=  '<h3>NADCM</h3>';
   sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
   sTableContent="",bHeaderCreated=false,sHeaderRow="";
   for(var x=0;x<(oObject.nadcm_data||[]).length;x++) {
      sTableContent+="<tr>";
      for(var skey in oObject.nadcm_data[x]) {
         if(!bHeaderCreated) {
            sHeaderRow+="<th>"+(skey)+"</th>";
         }
         sTableContent+="<td>"+(oObject.nadcm_data[x][skey]||"-")+"</td>";
      }
      sTableContent+="</tr>";
      bHeaderCreated=true;
   }
   sHTML+="<tr>"+sHeaderRow+"</tr>";
   sHTML+=sTableContent;
   sHTML+=  "</table>";
   sHTML+= '</div>';
   sHTML+= '<div id="menu6" class="tab-pane fade">';
   sHTML+=  '<h3>Cable labeling</h3>';
   sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
   sTableContent="",bHeaderCreated=false,sHeaderRow="";
   for(var x=0;x<(oObject.cable_labeling||[]).length;x++) {
      sTableContent+="<tr>";
      for(var skey in oObject.cable_labeling[x]) {
         if(!bHeaderCreated) {
            sHeaderRow+="<th>"+(skey)+"</th>";
         }
         sTableContent+="<td>"+(oObject.cable_labeling[x][skey]||"-")+"</td>";
      }
      sTableContent+="</tr>";
      bHeaderCreated=true;
   }
   sHTML+="<tr>"+sHeaderRow+"</tr>";
   sHTML+=sTableContent;
   sHTML+=  "</table>";
   sHTML+= '</div>';
   //switch_power_connection
   sHTML+= '<div id="menu7" class="tab-pane fade">';
   sHTML+=  '<h3>Switch Power Connection</h3>';
   sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
   sTableContent="",bHeaderCreated=false,sHeaderRow="";
   for(var x=0;x<(oObject.switch_power_connection||[]).length;x++) {
      sTableContent+="<tr>";
      for(var skey in oObject.switch_power_connection[x]) {
         if(!bHeaderCreated) {
            sHeaderRow+="<th>"+(skey)+"</th>";
         }
         sTableContent+="<td>"+(oObject.switch_power_connection[x][skey]||"&nbsp;")+"</td>";
      }
      sTableContent+="</tr>";
      bHeaderCreated=true;
   }
   sHTML+="<tr>"+sHeaderRow+"</tr>";
   sHTML+=sTableContent;
   sHTML+=  "</table>";
   sHTML+= '</div>';
   //configuration_data
   sHTML+= '<div id="menu8" class="tab-pane fade">'
   sHTML+=  '<h3>Selections</h3>';
   try {
      for(var y=0;y<(oObject.configuration_data||[]).length;y++) {
         var oTmpObj=JSON.parse(oObject.configuration_data[y].cfg_data);
         sHTML+=  "<p>"+oTmpObj.asset_id+"</p>";
         sHTML+=  "<p>"+oTmpObj.model_version+"</p>";
         sHTML+=  "<p>"+oTmpObj.model_name+"</p>";
         sHTML+=  "<table class='table table-striped table-bordered table-hover table-condensed'>";
         sTableContent="",bHeaderCreated=false,sHeaderRow="";
         for(var x=0;x<(oTmpObj.selections||[]).length;x++) {
            sTableContent+="<tr>";
            for(var skey in oTmpObj.selections[x]) {
               if(!bHeaderCreated) {
                  sHeaderRow+="<th>"+(skey)+"</th>";
               }
               sTableContent+="<td>"+(oTmpObj.selections[x][skey]||"-")+"</td>";
            }
            sTableContent+="</tr>";
            bHeaderCreated=true;
         }
         sHTML+="<tr>"+sHeaderRow+"</tr>";
         sHTML+=sTableContent;
         sHTML+=  "</table>";
      }
   } catch(eitaaskaan) {}
   sHTML+= '</div>';
   sHTML+='</div>';
   $("#content").html(sHTML);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doShow3D(nInLayers,sInContent,bInManualControl,nInWidthPx,nInHeightPx) {
   var sHTML="",fPicWidth=400,fPicHeight=600,nXtmp=nGxorigo,fTmpsize=fGsize;
   var xConf={data:{solution:oGActiveSolution}};
   doGetObjectBySerId("Update");
   doGetObjectByReqId("Update");
   lGCables={};
   sGAssetVisited="";
   sGSVGCables="";
   sSGVvisited="";
   nGResY=0;
   nGYshift=0;
   if(!(bInManualControl||false)) nGxorigo=10;
   //<--editor
   sGAssetVisited="";
   if(sInContent=="content") {//Get width of the content
      nGViewMode=2;
      doSwitchView();
      var aTHVertex=[0,0,0,0,0,0];//[x1,y1,z1,x2,y2,z2]
      for(var ccc in xConf.data.solution.objects) {
         var oTObject=xConf.data.solution.objects[ccc];
         if(typeof oTObject.location !== 'undefined') {
            if(typeof oTObject.dimensions !== 'undefined') {
               if(parseInt(parseInt(oTObject.location.x||0.0))>parseInt(aTHVertex[0])) {
                  aTHVertex[0]=parseInt(parseInt(oTObject.location.x||0));
               }
               if(parseInt(parseInt(oTObject.location.y||0.0))>parseInt(aTHVertex[1])) {
                  aTHVertex[1]=parseInt(parseInt(oTObject.location.y||0));
               }
               if(parseInt(parseInt(oTObject.location.x||0.0)+parseInt(oTObject.dimensions.width||0))>parseInt(aTHVertex[3])) {
                  aTHVertex[3]=parseInt(parseInt(oTObject.location.x||0)+parseInt(oTObject.dimensions.width||0));
               }
               if(parseInt(parseInt(oTObject.location.y||0.0)+parseInt(oTObject.dimensions.height||0))>parseInt(aTHVertex[4])) {
                  aTHVertex[4]=parseInt(parseInt(oTObject.location.y||0)+parseInt(oTObject.dimensions.height||0));
               }
            }
         }
      }
      //Get window size:
      try {
         fPicWidth=document.getElementById("content").offsetWidth;
      } catch(e) {
         fPicWidth=200;
      }
      try {
         fPicHeight=document.getElementById("content").offsetHeight;
      } catch(e) {
         fPicHeight=600;
      }
      if(fPicHeight<600) fPicHeight=600;
      //Scale based on width to fit in narrow window: 600px
      var ftmpapu=((parseInt(aTHVertex[0]>aTHVertex[3] ? aTHVertex[0]:aTHVertex[3])/(fPicWidth-50)));
      var ftmpapu2=((parseInt(aTHVertex[1]>aTHVertex[4] ? aTHVertex[1]:aTHVertex[4])/(fPicHeight-25)));
      var nSVGHeightpx=fPicHeight;
      if(ftmpapu2>ftmpapu) {
         ftmpapu=ftmpapu2;
      }
      if(!(bInManualControl||false)) fGsize=(1/(ftmpapu||1));
      if((parseInt(parseInt(aTHVertex[1]>aTHVertex[4] ? aTHVertex[1]:aTHVertex[4])*ftmpapu)<nSVGHeightpx)) nSVGHeightpx=parseInt(parseInt(aTHVertex[1]>aTHVertex[4] ? aTHVertex[1]:aTHVertex[4])*ftmpapu);
      if(nSVGHeightpx>600) nSVGHeightpx=600;
      if(nSVGHeightpx<100) nSVGHeightpx=600;
      if(!(bInManualControl||false)) nGyorigo=(nSVGHeightpx);
      sHTML+="<div><div>x angle <span class=\"badge\">"+nGxkierto+"</span> y angle <span class=\"badge\">"+nGykierto+"</span>z angle<span class=\"badge\">"+nGzkierto+"</span>Size<span class=\"badge\">"+fGsize.toPrecision(2)+"</span>Show layers<span class=\"badge\">"+nGLayers+"</span>Y shift<span class=\"badge\">"+nGyorigo+"</span>X shift<span class=\"badge\">"+nGxorigo+"</span></div><div class=\"btn-group\">";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGzkierto-=10;doShow3D(nGLayers,'"+sInContent+"',true);\">Z-angle-</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGzkierto+=10;doShow3D(nGLayers,'"+sInContent+"',true);\">Z-angle+</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxkierto-=10;doShow3D(nGLayers,'"+sInContent+"',true);\">X-angle-</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxkierto+=10;doShow3D(nGLayers,'"+sInContent+"',true);\">X-angle+</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGykierto-=10;doShow3D(nGLayers,'"+sInContent+"',true);\">Y-angle-</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGykierto+=10;doShow3D(nGLayers,'"+sInContent+"',true);\">Y-angle+</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"fGsize+=0.05;doShow3D(nGLayers,'"+sInContent+"',true);\">Size+</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"fGsize-=0.05;doShow3D(nGLayers,'"+sInContent+"',true);\">Size-</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGLayers++;doShow3D(nGLayers,'"+sInContent+"',true);\">Layers+</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGLayers--;doShow3D(nGLayers,'"+sInContent+"',true);\">Layers-</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGyorigo-=50;doShow3D(nGLayers,'"+sInContent+"',true);\">Y-</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGyorigo+=50;doShow3D(nGLayers,'"+sInContent+"',true);\">Y+</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxorigo-=50;doShow3D(nGLayers,'"+sInContent+"',true);\">X-</button>";
      sHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxorigo+=50;doShow3D(nGLayers,'"+sInContent+"',true);\">X+</button>";
      sHTML+="</div></div>";
      sHTML+="<svg id=\"svg1\" width=\"100%\" height=\""+nSVGHeightpx+"px\" ondrop=\"drop2(event)\" ondragover=\"allowDrop(event)\">";
      //sHTML+="<svg id=\"svg1\" width=\"100%\" height=\""+parseInt(fPicHeight)+"px\" ondrop=\"drop2(event)\" ondragover=\"allowDrop(event)\">";
      for(var ccc=0;ccc<xConf.data.solution.objects.length;ccc++) {
         var oInObject=xConf.data.solution.objects[ccc];
         if((typeof oInObject.dimensions!=='undefined')||(typeof oInObject.diameter!=='undefined')) {
            try { sHTML+=doGetSVG4Object(oInObject); }catch(e){}
         }
      }
      sHTML+="</svg>"
      try {
         $("#content").html(sHTML);
      } catch(e) {
         console.log("SVG creation problem:"+e.message);
      }
   } else {//Show in small window
      //Set the fGsize for the configuration if the value is default value 0.15
      var aTHVertex=[999999999,0,0,0,0,0];//[x1,y1,z1,x2,y2,z2]
      for(var ccc in xConf.data.solution.objects) {
         var oTObject=xConf.data.solution.objects[ccc];
         if(typeof oTObject.location !== 'undefined') {
            if(typeof oTObject.dimensions !== 'undefined') {
               if(typeof oTObject.diameter === 'undefined') {
                  if(parseInt(parseInt(oTObject.location.x||0.0))<parseInt(aTHVertex[0])) {
                     aTHVertex[0]=parseInt(parseInt(oTObject.location.x||0));
                  }
                  if(parseInt(parseInt(oTObject.location.y||0.0))>parseInt(aTHVertex[1])) {
                     aTHVertex[1]=parseInt(parseInt(oTObject.location.y||0));
                  }
                  if(parseInt(parseInt(oTObject.location.x||0.0)+parseInt(oTObject.dimensions.width||0))>parseInt(aTHVertex[3])) {
                     aTHVertex[3]=parseInt(parseInt(oTObject.location.x||0)+parseInt(oTObject.dimensions.width||0));
                  }
                  if(parseInt(parseInt(oTObject.location.y||0.0)+parseInt(oTObject.dimensions.height||0))>parseInt(aTHVertex[4])) {
                     aTHVertex[4]=parseInt(parseInt(oTObject.location.y||0)+parseInt(oTObject.dimensions.height||0));
                  }
               }
            }
         }
      }
      //Get window size:
      try {
         fPicWidth=document.getElementById(sInContent).offsetWidth;
      } catch(e) {
         fPicWidth=200;
      }
      try {
         fPicHeight=document.getElementById(sInContent).offsetHeight;
      } catch(e) {
         fPicHeight=300;
      }
      if(fPicHeight<600) fPicHeight=600;
      /*
      if(typeof nInHeightPx!=='undefined') {
         fPicHeight=parseFloat(nInHeightPx);
      }
      if(typeof nInWidthPx!=='undefined') {
         fPicWidth=parseFloat(nInWidthPx);
      }
      */
      //Scale based on width to fit in narrow window: 600px
      var ftmpapu=((parseInt(aTHVertex[0]>aTHVertex[3] ? aTHVertex[0]:aTHVertex[3])/(fPicWidth-50)));
      var ftmpapu2=((parseInt(aTHVertex[1]>aTHVertex[4] ? aTHVertex[1]:aTHVertex[4])/(fPicHeight-25)));
      var nSVGHeightpx=fPicHeight;
      if(ftmpapu2>ftmpapu) {
         ftmpapu=ftmpapu2;
      }
      fGsize=(1/(ftmpapu||1));
      nGxorigo=-(parseInt(aTHVertex[0]<aTHVertex[3] ? aTHVertex[0]:aTHVertex[3])-10)*fGsize;

      if(nSVGHeightpx>600) nSVGHeightpx=600;
      if(nSVGHeightpx<50) nSVGHeightpx=100;
      if((parseInt(parseInt(aTHVertex[1]>aTHVertex[4] ? aTHVertex[1]:aTHVertex[4])*ftmpapu)<nSVGHeightpx)) nSVGHeightpx=parseInt(parseInt(aTHVertex[1]>aTHVertex[4] ? aTHVertex[1]:aTHVertex[4])*ftmpapu);
      if(nSVGHeightpx<100) nSVGHeightpx=100;
      nGyorigo=(nSVGHeightpx);
      var nTmpXkierto=nGxkierto;
      var nTmpYkierto=nGykierto;
      var nTmpZkierto=nGzkierto;
      nGxkierto=0;
      nGykierto=0;
      nGzkierto=0;
      sHTML="";
      for(var ccc=0;ccc<(xConf.data.solution.objects||[]).length;ccc++) {
         var oInObject=xConf.data.solution.objects[ccc];
         if((typeof oInObject.dimensions!=='undefined')||(typeof oInObject.diameter!=='undefined')) {
            try {
               sHTML+=doGetSVG4Object(oInObject);
            } catch(e) {}
         }
      }
      sHTML="<svg id=\""+(xConf.data.solution.ZCONFIG_ID||"")+"\" width=\"100%\" height=\""+nSVGHeightpx+"px\" ondrop=\"drop2(event)\" ondragover=\"allowDrop(event)\">"+sHTML;
      sHTML+="</svg>"
      nGxkierto=nTmpXkierto;
      nGykierto=nTmpYkierto;
      nGzkierto=nTmpZkierto;
      $("#"+sInContent).html(sHTML);
   }
   nGxorigo=nXtmp;
   return(sHTML);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doParseFromCMLui(sInCodeInTxt) {
   var oResultObject={};
   var vNextWord="";
   var nLoopBreak=10000;
   var aResponce=[];
   var oCurrObject={};
   var oCurrParentObject={};
   var lObjectPath=[];
   var oCurrModel=[];
   oCurrModel=JSON.parse('{"name":"CML UI definitions","objects":[]}');//create container object
   do {
      aResponce=doGetNextWord(sInCodeInTxt);
      vNextWord=aResponce[0];
      sInCodeInTxt=aResponce[1];
      //console.log("->'"+vNextWord+"'");
      switch(vNextWord) {
         case "options":
            break;
         case "layout":
            break;
         case "note":
            //Remove space(s) tabs and return(s)
            do {
               aResponce=doGetNextWord(sInCodeInTxt);
               vNextWord=aResponce[0];
               sInCodeInTxt=aResponce[1];
            } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
            console.log("note name:'"+vNextWord+"'");
            var sTestName=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
            oCurrObject=JSON.parse('{"name":"note"}');//create object
            oCurrObject.name=sTestName;
            oCurrObject.note=true;
            if(lObjectPath.length>0) {
               oCurrParentObject=lObjectPath.pop();
               if(typeof oCurrParentObject.cstics==='undefined') oCurrParentObject.cstics=[];
               oCurrParentObject.cstics.push(oCurrObject);
               lObjectPath.push(oCurrParentObject);
            } else {
               console.log("Something went wrong???? stack was empty??? '"+vNextWord+sGetExampleCode(sInCodeInTxt)+"'");
            }
            break;
         case "cstic":
            //Remove space(s) tabs and return(s)
            do {
               aResponce=doGetNextWord(sInCodeInTxt);
               vNextWord=aResponce[0];
               sInCodeInTxt=aResponce[1];
            } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
            console.log("cstic name:'"+vNextWord+"'");
            var sTestName=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
            oCurrObject=JSON.parse('{"name":"cstic"}');//create object
            oCurrObject.name=sTestName;
            if(lObjectPath.length>0) {
               oCurrParentObject=lObjectPath.pop();
               if(typeof oCurrParentObject.cstics==='undefined') oCurrParentObject.cstics=[];
               oCurrParentObject.cstics.push(oCurrObject);
               lObjectPath.push(oCurrParentObject);
            } else {
               console.log("Something went wrong???? stack was empty??? '"+vNextWord+sGetExampleCode(sInCodeInTxt)+"'");
            }
            break;
         case "row":
            oCurrObject=JSON.parse('{"name":"row"}');//create object
            if(lObjectPath.length>0) {
               oCurrParentObject=lObjectPath.pop();
               if(typeof oCurrParentObject.rows==='undefined') oCurrParentObject.rows=[];
               oCurrParentObject.rows.push(oCurrObject);
               lObjectPath.push(oCurrParentObject);
            } else {
               console.log("Something went wrong???? stack was empty??? '"+vNextWord+sGetExampleCode(sInCodeInTxt)+"'");
            }
            break;
         case "instanceLayout":
            //Remove space(s) tabs and return(s)
            do {
               aResponce=doGetNextWord(sInCodeInTxt);
               vNextWord=aResponce[0];
               sInCodeInTxt=aResponce[1];
            } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
            console.log("Object name:'"+vNextWord+"'");
            var bExists=false,sTestName=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
            for(var ig=0;ig<oCurrModel.objects.length;ig++) {
               if((oCurrModel.objects[ig].name||"NoName")==(sTestName)) {
                  oCurrObject=oCurrModel.objects[ig];
                  bExists=true;
                  break;
               }
            }
            if(!bExists) {
               oCurrObject=JSON.parse('{"name":""}');//create object
               oCurrObject.name=sTestName;
               oCurrModel.objects.push(oCurrObject);
            }
            oResultObject=oCurrModel;
            break;
         case "group":
            //Remove space(s) tabs and return(s)
            do {
               aResponce=doGetNextWord(sInCodeInTxt);
               vNextWord=aResponce[0];
               sInCodeInTxt=aResponce[1];
            } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
            console.log("Object name:'"+vNextWord+"'");
            var sTestName=vNextWord.replace(/\'/gmi,'').replace(/\"/gmi,'');
            oCurrObject=JSON.parse('{"name":""}');//create object
            oCurrObject.name=sTestName;
            //Remove space(s) and take possible description "Description...."
            do {
               aResponce=doGetNextWord(sInCodeInTxt);
               vNextWord=aResponce[0];
               sInCodeInTxt=aResponce[1];
            } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
            if(vNextWord.charAt(0)=="\"") {
               oCurrObject.description=vNextWord.replace(/\"/gmi,'');
            } else {
               bSkipNext=true;
            }
            if(lObjectPath.length>0) {
               oCurrParentObject=lObjectPath.pop();
               if(typeof oCurrParentObject.groups==='undefined') oCurrParentObject.groups=[];
               oCurrParentObject.groups.push(oCurrObject);
               lObjectPath.push(oCurrParentObject);
            } else {
               console.log("Something went wrong???? stack was empty??? '"+vNextWord+sGetExampleCode(sInCodeInTxt)+"'");
            }
            break;
         case "["://Get attributes to the current object
            //Remove space(s) tabs and return(s)
            do {
               aResponce=doGetNextWord(sInCodeInTxt);
               vNextWord=aResponce[0];
               sInCodeInTxt=aResponce[1];
            } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
            do {
               switch(vNextWord) {
                  case "sheaderwidth":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "bodywidth":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "inputfieldsize":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "inputfieldlength":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "inputformat":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "span":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "scrollareawidth":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "scrollareaheight":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "layout":
                     var sAttrName=vNextWord;
                     do {
                        aResponce=doGetNextWord(sInCodeInTxt);
                        vNextWord=aResponce[0];
                        sInCodeInTxt=aResponce[1];
                     } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                     oCurrObject[sAttrName]=vNextWord;
                     break;
                  case "material":
                        var sAttrName=vNextWord;
                        do {
                           aResponce=doGetNextWord(sInCodeInTxt);
                           vNextWord=aResponce[0];
                           sInCodeInTxt=aResponce[1];
                        } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
                        oCurrObject[sAttrName]=vNextWord;
                        break;
                  default: //Other attributes are added as name=true values
                        if((vNextWord||"")!="]"){
                           var sAttrName=vNextWord;
                           oCurrObject[sAttrName]=true;
                        }
               }
               if(vNextWord!="]"){
                  //Remove space(s) tabs and return(s)
                  do {
                     aResponce=doGetNextWord(sInCodeInTxt);
                     vNextWord=aResponce[0];
                     sInCodeInTxt=aResponce[1];
                  } while(((vNextWord==" ")||(vNextWord=="\t")||(vNextWord=="\r")||(vNextWord=="\n"))&&(sInCodeInTxt.length>0));
               }
            } while((vNextWord!="]")&&(sInCodeInTxt.length>0));
            break;
         case "import"://This parser ignores import commands!
               //Remove space(s)
               do {
                  aResponce=doGetNextWord(sInCodeInTxt);
                  vNextWord=aResponce[0];
                  sInCodeInTxt=aResponce[1];
               } while(((vNextWord==" ")||(vNextWord=="\t"))&&(sInCodeInTxt.length>0));
               break;
         case "{":
            lObjectPath.push(oCurrObject);
            break;
         case "}":
            if(lObjectPath.length>0) {
                  oCurrObject=lObjectPath.pop();
            } else {
               console.log("Something went wrong???? '}' was not expected??? '"+vNextWord+sGetExampleCode(sInCodeInTxt)+"'");
            }
            break;
      }
   } while((vNextWord!="")&&((nLoopBreak--)>0)&&((sInCodeInTxt.length>0)));
   if(nLoopBreak<0) console.log("Loop break-> Something went wrong????");
   return(oResultObject);
}
//----------------------------------------------------------------------------------------------------------------
function export2cml() {
   var scml="",stmp="";
   scml+="options [";
   if(typeof oGActiveModel.layout !=='undefined') {
      scml+="layout "+(oGActiveModel.layout||"").replace(/\ /,'_')+" ";
   } else {
      scml+="layout "+(oGActiveModel.name||"").replace(/\ /,'_')+" ";
   }
   if(typeof oGActiveModel.statementsPerProcedure !=='undefined') {
      scml+="statementsPerProcedure "+(oGActiveModel.statementsPerProcedure)+" ";
   }
   if(typeof oGActiveModel.characteristicsPerClass !=='undefined') {
      scml+="characteristicsPerClass "+(oGActiveModel.characteristicsPerClass)+" ";
   }
   scml+="]\n\n";
   scml=scml.replace(/\ \]/,"]");
   for(var x in oGActiveModel.objects) {
      if((oGActiveModel.objects.type||"").toUpperCase()=="PRODUCT") {
         scml+="\nobject \""+oGActiveModel.objects[x].name+"\" {";
         scml+="\n  \"type\":\"Product\"";
      } else {
         scml+="\nobject \""+oGActiveModel.objects[x].name+"\" {";
      }
      stmp="";
      if(oGActiveModel.objects[x].precondition) {
         scml+="\n   preconditions {";
         scml+="\n      rule \""+(oGActiveModel.objects[x].precondition||"")+"\"";
         scml+="\n   }";
      }

      for(var xr in oGActiveModel.objects[x].requirements) {
         if(typeof oGActiveModel.objects[x].requirements[xr].requirement==='string') {
            stmp+="\n      \""+oGActiveModel.objects[x].requirements[xr].requirement+"\"";
         }
      }
      if(stmp!="") {
         scml+="\n   requirements {";
         scml+=stmp;
         scml+="\n   }";
      }
      stmp="";
      for(var xs in oGActiveModel.objects[x].services) {
         if(typeof oGActiveModel.objects[x].services[xs].service==='string') {
            stmp+="\n      \""+oGActiveModel.objects[x].services[xs].service+"\"";
         }
      }
      if(stmp!="") {
         scml+="\n   services {";
         scml+=stmp;
         scml+="\n   }";
      }
      scml+="\n}";
   }
   document.getElementById("content").innerHTML="CML file content created.";
   var blobObject=new Blob([scml]);
   var location = (oGActiveModel.name||"")+"model.cml2";
   window.navigator.msSaveBlob(blobObject,location);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function sGetExampleCode(sInTxt) {
   var nTLength=128;
   if(sInTxt.length<nTLength) nTLength=sInTxt.length;
   return(sInTxt.substring(0,nTLength));
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doGetNextWord(sInSourceTxt) {
   var sWord="",bEnd=false,nLoopBreak=128;
   if(sInSourceTxt.length>0) {
      do {
         bEnd=true;
         if((sInSourceTxt.charAt(0)||"")=="/") {
            if((sInSourceTxt.charAt(1)||"")=="/") {//Remove line
               sInSourceTxt=sInSourceTxt.substr(2);
               do {
                  sInSourceTxt=sInSourceTxt.substr(1);
               } while(!((sInSourceTxt.charAt(0)||"").match(/(\n)|(\r)/))&&(sInSourceTxt!=""));
            } else if((sInSourceTxt.charAt(1)||"")=="*") {//Remove line
               sInSourceTxt=sInSourceTxt.substr(2);
               do {
                  sInSourceTxt=sInSourceTxt.substr(1);
               } while(!(((sInSourceTxt.charAt(0)||"")=="*")&&((sInSourceTxt.charAt(1)||"")=="/"))&&(sInSourceTxt!=""));
               sInSourceTxt=sInSourceTxt.substr(2);
            }
         }
         if((sInSourceTxt.charAt(0)||"").match(/([A-Z])|([a-z])|([0-9])|(\_)|(\-)|(\")|(\')/)) {
            bEnd=false;
            if((sInSourceTxt.charAt(0)||"").match(/(\")|(\')/)) {
               var sEndingChar=sInSourceTxt.charAt(0);
               do {
                  sWord+=sInSourceTxt.charAt(0);
                  sInSourceTxt=sInSourceTxt.substr(1);
               } while((sInSourceTxt.charAt(0)!=sEndingChar)&&(sInSourceTxt.length>0));
               sWord+=sEndingChar;
               if(sInSourceTxt.length>0) sInSourceTxt=sInSourceTxt.substr(1);
            } else {
               sWord+=sInSourceTxt.charAt(0);
               sInSourceTxt=sInSourceTxt.substr(1);
            }
         } else {
            if(sWord==""){sWord+=sInSourceTxt.charAt(0);sInSourceTxt=sInSourceTxt.substr(1);}
         }
         if(sInSourceTxt.length==0) bEnd=true;
      } while((!bEnd)&&((nLoopBreak--)>0));
   }
   if(nLoopBreak==0) console.log("Something went wrong in doGetNextWord function? sWord='"+sWord+"'");
   return([sWord,sInSourceTxt]);
}
//----------------------------------------------------------------------------------------------------------------
function doTestCIDAPI() {
   $.get('https://wrmintfv02.emea.nsn-net.net/afs-test/api/v1/customer-orders/get-data-str-by-id/CID_RM_00000000537', function(data,status) {
      if(status=='success') {
         $("#content").html(data);
      } else {
         $("#content").html(status);
      }});
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doPostMessage(oInJSON) {
   var xConf = getConfigByID(sGSelectedConfigurationID);
   if(xConf != null) {
      try {
         if(typeof(Worker) !== "undefined") {
            if(sGSelectedConfigurationID != "") {
               if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined') {
                  xConf.data.messageobject = JSON.parse(JSON.stringify(oInJSON));
                  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
                  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
               }
            }
         }
      } catch(e) {
         document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration or message?</span>";
      }
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doRotateX(nInAngle,aInPoints) {
   var cosini = Math.cos(nInAngle),sini = Math.sin(nInAngle),oPoint={x:0,y:0,z:0},nY=0,nZ=0;
   for(var i=0;i<aInPoints.length;i++) {
      oPoint=aInPoints[i];
      nY=oPoint.y*cosini-oPoint.z*sini;
      nZ=oPoint.z*cosini+oPoint.y*sini;
      oPoint.y=parseInt(nY);
      oPoint.z=parseInt(nZ);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doRotateY(nInAngle,aInPoints) {
   var cosini = Math.cos(nInAngle),sini = Math.sin(nInAngle),oPoint={x:0,y:0,z:0},nX=0,nZ=0;
   for(var i=0;i<aInPoints.length;i++) {
      oPoint=aInPoints[i];
      nX=oPoint.x*cosini-oPoint.z*sini;
      nZ=oPoint.z*cosini+oPoint.x*sini;
      oPoint.x=parseInt(nX);
      oPoint.z=parseInt(nZ);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doRotateZ(nInAngle,aInPoints) {
   var cosini = Math.cos(nInAngle),sini = Math.sin(nInAngle),oPoint={x:0,y:0,z:0},nY=0,nX=0;
   for(var i=0;i<aInPoints.length;i++) {
      oPoint=aInPoints[i];
      nX=oPoint.x*cosini-oPoint.y*sini;
      nY=oPoint.y*cosini+oPoint.x*sini;
      oPoint.x=parseInt(nX);
      oPoint.y=parseInt(nY);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doScalePoints(fInScale,aInPoints) {
   for(var tmplI=0;tmplI<aInPoints.length;tmplI++) {
      //Laitetaan pyörähdyskappale paikoilleen
      aInPoints[tmplI].x=parseInt(fInScale*aInPoints[tmplI].x);
      aInPoints[tmplI].y=parseInt(fInScale*aInPoints[tmplI].y);
      aInPoints[tmplI].z=parseInt(fInScale*aInPoints[tmplI].z);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doCreateCylinder(oInObject,aInParts) {
   //Needed attributes from the object: frontdiameter, backdiameter    - [in mm]
   var nFDiameter=parseInt(parseInt(oInObject.frontdiameter||100)/2),nStep=parseInt(oInObject.step||20),nBDiameter=parseInt(parseInt(oInObject.backdiameter||100)/2);
   var nx1=nFDiameter,ny1=0,nz1=0,nx2=nBDiameter,ny2=0,nz2=parseInt((oInObject.dimensions||{}).depth||50);
   var aFrontPoints=[],aSidepoints=[],aBackPoints=[];
   for(var i=0;i<360;i+=nStep) {
      var oPoint={x:nx1,y:ny1,z:nz1}
      doRotateZ(i*3.1415/180.0,[oPoint]);
      aFrontPoints.push(oPoint);
      var oPoint2={x:-nx2,y:ny1,z:nz2}
      doRotateZ((180-i)*3.1415/180.0,[oPoint2]);
      aBackPoints.push(oPoint2);
      var oPoint3={x:nx2,y:ny2,z:nz2}
      doRotateZ(i*3.1415/180.0,[oPoint3]);
      aSidepoints.push(oPoint3);
   }
   aInParts.push({name:"Front",parts:aFrontPoints});
   var j=aFrontPoints.length;
   for(var i=0;i<j;i++) {
      var aSidePlates=[];
      aSidePlates.push(JSON.parse(JSON.stringify(aFrontPoints[i])));
      aSidePlates.push(JSON.parse(JSON.stringify(aSidepoints[i])));
      aSidePlates.push(JSON.parse(JSON.stringify(aSidepoints[((i+1)==j ? 0:i+1)])));
      aSidePlates.push(JSON.parse(JSON.stringify(aFrontPoints[((i+1)==j ? 0:i+1)])));
      aInParts.push({name:"",parts:aSidePlates});
   }
   aInParts.push({name:"Back",parts:aBackPoints});
   if(oInObject.arotation) {
      for(var ji=0;ji<aInParts.length;ji++) {
         doRotateZ(parseInt(oInObject.arotation.z||0)*3.1415/180.0,aInParts[ji].parts);
         doRotateX(parseInt(oInObject.arotation.x||0)*3.1415/180.0,aInParts[ji].parts);
         doRotateY(parseInt(oInObject.arotation.y||0)*3.1415/180.0,aInParts[ji].parts);
      }
   }
   for(var ji=0;ji<aInParts.length;ji++) {
      for(var i=0;i<(aInParts[ji].parts.length);i++) {
         aInParts[ji].parts[i].x+=parseInt(oInObject.location.x);
         aInParts[ji].parts[i].y+=parseInt(oInObject.location.y);
         aInParts[ji].parts[i].z+=parseInt(oInObject.location.z);
      }
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doCreateBox(oInObject,aInParts) {
   var nox=0,noy=0,noz=0,nx1=0,ny1=0,nz1=0,nx2=parseInt((oInObject.dimensions||{}).width||0),ny2=parseInt((oInObject.dimensions||{}).height||0),nz2=parseInt((oInObject.dimensions||{}).depth||0);
   aInParts.push({name:"Front",parts:[{x:nx1,y:ny1,z:nz1},{x:nx2,y:ny1,z:nz1},{x:nx2,y:ny2,z:nz1},{x:nx1,y:ny2,z:nz1}]});//taso 1 (etulevy)
   aInParts.push({name:"Back",parts:[{x:nx2,y:ny1,z:nz2},{x:nx1,y:ny1,z:nz2},{x:nx1,y:ny2,z:nz2},{x:nx2,y:ny2,z:nz2}]});//taso 2 (takalevy)
   aInParts.push({name:"Left",parts:[{x:nx1,y:ny1,z:nz2},{x:nx1,y:ny1,z:nz1},{x:nx1,y:ny2,z:nz1},{x:nx1,y:ny2,z:nz2}]});//taso 3 (vasen-sivu-levy)
   aInParts.push({name:"Right",parts:[{x:nx2,y:ny1,z:nz1},{x:nx2,y:ny1,z:nz2},{x:nx2,y:ny2,z:nz2},{x:nx2,y:ny2,z:nz1}]});//taso 4 (oikea-sivu-levy)
   aInParts.push({name:"Top",parts:[{x:nx1,y:ny2,z:nz1},{x:nx2,y:ny2,z:nz1},{x:nx2,y:ny2,z:nz2},{x:nx1,y:ny2,z:nz2}]});//taso 4 (oikea-sivu-levy)
   aInParts.push({name:"Bottom",parts:[{x:nx1,y:ny1,z:nz2},{x:nx2,y:ny1,z:nz2},{x:nx2,y:ny1,z:nz1},{x:nx1,y:ny1,z:nz1}]});//taso 4 (oikea-sivu-levy)
   if(oInObject.arotation) {
      for(var ji=0;ji<aInParts.length;ji++) {
         doRotateZ(parseInt(oInObject.arotation.z||0)*3.1415/180.0,aInParts[ji].parts);
         doRotateX(parseInt(oInObject.arotation.x||0)*3.1415/180.0,aInParts[ji].parts);
         doRotateY(parseInt(oInObject.arotation.y||0)*3.1415/180.0,aInParts[ji].parts);
      }
   }
   if(typeof oInObject.service!=='undefined') {
      if(typeof lGObjectsBySerId[oInObject.id]!=='undefined') {
         if(typeof lGObjectsBySerId[oInObject.id].location!=='undefined') {
            nox=parseInt(lGObjectsBySerId[oInObject.id].location.x||0);
            noy=parseInt(lGObjectsBySerId[oInObject.id].location.y||0);
            noz=parseInt(lGObjectsBySerId[oInObject.id].location.z||0);
         }
      }
   }
   for(var ji=0;ji<aInParts.length;ji++) {
      for(var i=0;i<(aInParts[ji].parts.length);i++) {
         aInParts[ji].parts[i].x+=parseInt(oInObject.location.x)+nox;
         aInParts[ji].parts[i].y+=parseInt(oInObject.location.y)+noy;
         aInParts[ji].parts[i].z+=parseInt(oInObject.location.z)+noz;
      }
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doCreateCable(oInObject,aInParts) {
   //Cable ends? 1-to-1, 1-to-many, many-to-1,many-to-many?
   //Mark points as part of cable->drawn differently!
   //set diameter
   //First-end
   //Second-end
   var onx=0,ony=0,onz=0,nx1=0,ny1=0,nz1=0,nx2=100,ny2=50,nz2=0,nReqT=(oInObject.requirements||[]).length,nSerT=(oInObject.services||[]).length;
   var aSPoints=[];
   var aEPoints=[];
   var aPoints=[];
   var oTmpObject={};
   if(typeof oInObject.location !=='undefined') {
      onx=parseInt(oInObject.location.x);
      ony=parseInt(oInObject.location.y);
      onz=parseInt(oInObject.location.z);
   }
   for(var i=0;i<nReqT;i++) {
      if(oInObject.requirements[i].description==="1st end") {
         if(oInObject.requirements[i].location) {
            aSPoints.push({x:parseInt(oInObject.requirements[i].location.x||0),y:parseInt(oInObject.requirements[i].location.y||0),z:parseInt(oInObject.requirements[i].location.z||0)});
         }
      } else if(oInObject.requirements[i].description==="2nd end") {
         if(oInObject.requirements[i].location) {
            aEPoints.push({x:parseInt(oInObject.requirements[i].location.x||0),y:parseInt(oInObject.requirements[i].location.y||0),z:parseInt(oInObject.requirements[i].location.z||0)});
         }
      }
   }
   for(var i=0;i<nSerT;i++) {
      if(oInObject.services[i].description==="1st end") {
         nx1=0;
         ny1=0;
         nz1=0;
         if(oInObject.services[i].location) {
            nx1=parseInt(oInObject.services[i].location.x||0);
            ny1=parseInt(oInObject.services[i].location.y||0);
            nz1=parseInt(oInObject.services[i].location.z||0);
         }
         aSPoints.push({x:parseInt(onx+nx1),y:parseInt(ony+ny1),z:parseInt(onz+nz1)});
      } else if(oInObject.services[i].description==="2nd end") {
         onx=0;//2nd end is not taking object location is static
         ony=0;
         onz=0;
         nx1=0;
         ny1=0;
         nz1=0;
         if(oInObject.services[i].location) {
            nx1=parseInt(oInObject.services[i].location.x||0);
            ny1=parseInt(oInObject.services[i].location.y||0);
            nz1=parseInt(oInObject.services[i].location.z||0);
         }
         aEPoints.push({x:parseInt(onx+nx1),y:parseInt(ony+ny1),z:parseInt(onz+nz1)});
      }
   }
   if(aSPoints.length>=aEPoints.length) {
      for(var j=0;j<aSPoints.length;j++) {
         try {
            aPoints.push(aSPoints[j]);
            aPoints.push(aEPoints[(j<aEPoints.length ? j:(aEPoints.length-1))]);
            aInParts.push({name:(oInObject.type||"Cable"),"type":"cable","diameter":parseInt(parseInt(oInObject.diameter||3)*fGsize),parts:aPoints});
         } catch(e) {
            //???
         }
      }
   } else {
      try {
         for(var j=0;j<aEPoints.length;j++) {
            aPoints.push(aSPoints[(j<aSPoints.length ? j:(aSPoints.length-1))]);
            aPoints.push(aEPoints[j]);
            aInParts.push({name:(oInObject.type||"Cable"),"type":"cable","diameter":parseInt(parseInt(oInObject.diameter||3)*fGsize),parts:aPoints});
         }
      } catch(e){}
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doGetSVG4Object(oInObject) {
   var sHTML="",fTmpX=0,fTmpY=0,fTmpZ=0,nInYKierto=0,nInXKierto=0,nInZKierto=0,nInLayers=1,sCableInfo="",sLocationInfo="",sULocation="",sPortName="",nLocationX=0,nLocationY=0,nLocationZ=0;
   if((oInObject!==null)&&(oInObject!==undefined)&&(oInObject.location!==undefined)&&((oInObject.dimensions!==undefined)||(oInObject.diameter!==undefined))) {

      //Piirretään objekti
      if(typeof oInObject.location !=='undefined') {
         var oOobject=lGObjectsBySerId[oInObject.id]||{};
         var nXn=0,nYn=0,nZn=0;
         if(oOobject.location){
            nXn=parseFloat(oOobject.location.x||0);
            nYn=parseFloat(oOobject.location.y||0);
            nZn=parseFloat(oOobject.location.z||0);
         }
         nLocationX=(parseFloat((oInObject.location.x||0))+nXn);
         nLocationY=(parseFloat((oInObject.location.y||0))+nYn);
         nLocationZ=(parseFloat((oInObject.location.z||0))+nZn);
         sLocationInfo+=" ("+nLocationX+","+nLocationY+","+nLocationZ+") ";
         sULocation=(oOobject.locationname||"");
         sPortName=(oInObject.service||"");
      }

      if(sGAssetVisited.indexOf("["+oInObject.id+"]")>=0) return(sHTML);
      sGAssetVisited+="["+oInObject.id+"]";
      sHTML+="<g id=\""+(oInObject.id)+"\">";
      var sColor="black",sFillColor="white",sOpacity="",bFrame=false;
      if(oInObject.fill) sFillColor=oInObject.fill;
      if((oInObject.connectedTo||[]).length>0) {
         if(oInObject.connectedfillcolor) sFillColor=oInObject.connectedfillcolor||"#000000";
         try {
            var sFirstEnds=" &#13;From:",sSecondEnds=" &#13;To:",oTmpConnectedObject=lGObjectsByReqId[oInObject.connectedTo[0]];
            if((oTmpConnectedObject.type||"")=="Cable") {
               for(var jk=0;jk<(oTmpConnectedObject.services||[]).length;jk++) {
                  if((oTmpConnectedObject.services[jk].description||"")=="1st end") {
                     for(var xvv in oTmpConnectedObject.services[jk]) {
                        if(xvv.indexOf("connectivity")>=0) sFirstEnds+=" &#13;"+oTmpConnectedObject.services[jk][xvv]||"";
                     }
                  }
                  if((oTmpConnectedObject.services[jk].description||"")=="2nd end") {
                     for(var xvv in oTmpConnectedObject.services[jk]) {
                        if(xvv.indexOf("connectivity")>=0) sSecondEnds+=" &#13;"+oTmpConnectedObject.services[jk][xvv]||"";
                     }
                  }
               }
               for(var jk=0;jk<(oTmpConnectedObject.requirements||[]).length;jk++) {
                  if((oTmpConnectedObject.requirements[jk].description||"")=="1st end") sFirstEnds+=" &#13;"+oTmpConnectedObject.requirements[jk].requirement||"";
                  if((oTmpConnectedObject.requirements[jk].description||"")=="2nd end") sSecondEnds+=" &#13;"+oTmpConnectedObject.requirements[jk].requirement||"";
               }
               sCableInfo=sFirstEnds+sSecondEnds;
            }
         } catch(eiok){}
      }
      if(oInObject.color) sColor=oInObject.color;
      if(oInObject.frame) {
         sFillColor="none";
         bFrame=true;
      }
      if(oInObject.extended) {
         sColor="black";
         sOpacity="fill-opacity:1.0;stroke-opacity:0.2";
         sFillColor="white";
      } else {
         sOpacity="fill-opacity:0.5;stroke-opacity:0.5";
      }
      if(sGCurrentObjectID==oInObject.id) sOpacity="fill-opacity:0.5;stroke-opacity:1.0";
      var aParts=[];
      switch (oInObject.type) {
         case "Antenna":
            doCreateCylinder(oInObject,aParts);
            break;
         case "Cable":
            doCreateCable(oInObject,aParts);
            break;
         case "Fiber":
            doCreateCable(oInObject,aParts);
         break;
         case "PoE":
            doCreateCable(oInObject,aParts);
            break;
         case "Flextwist":
            doCreateCable(oInObject,aParts);
         break;
         case "Power cable":
            doCreateCable(oInObject,aParts);
            break;
         case "DCable":
            doCreateCable(oInObject,aParts);
         break;
         default:
            doCreateBox(oInObject,aParts);
      }
      for(var ji=0;ji<aParts.length;ji++) {
         var aPoints=JSON.parse(JSON.stringify(aParts[ji].parts));
         doRotateZ((nGzkierto+nInZKierto)*3.1415/180.0,aPoints);
         doRotateX((nGxkierto+nInXKierto)*3.1415/180.0,aPoints);
         doRotateY((nGykierto+nInYKierto)*3.1415/180.0,aPoints);
         doScalePoints(fGsize,aPoints);
         if(aParts[ji].type==="cable") {
            var sPoints="";
            for(var j=0;j<aPoints.length;j++) {
               sPoints+=(parseInt(aPoints[j].x)+parseInt(nGxorigo))+","+(parseInt(nGyorigo)-parseInt(aPoints[j].y))+" ";
            }
            sHTML+="<polyline points=\""+sPoints+"\" style=\"fill:none;stroke:"+(aParts[ji].fillcolor||sFillColor)+";stroke-width:"+(aParts[ji].diameter||3)+";"+sOpacity+"\">";
            sHTML+="<title>"+sLocationInfo+((oInObject["service"]||oInObject["name"]||"")+" &#13;"+(oInObject["description"]||""))+" &#13;"+sCableInfo+"</title>";
            sHTML+="</polygon>";
         } else {
            if((bVisibleSide(aPoints)==true)||(bFrame)) {
               var sPoints="";
               for(var j=0;j<aPoints.length;j++) {
                  sPoints+=(parseInt(aPoints[j].x)+parseInt(nGxorigo))+","+(parseInt(nGyorigo)-parseInt(aPoints[j].y))+" ";
               }
               if(bGCableRuleCreationMode){
                  sHTML+="<polygon onclick=\"doSelectPort('"+sULocation+"','"+sPortName+"',"+nLocationX+","+nLocationY+","+nLocationZ+")\" points=\""+sPoints+"\" style=\"fill:"+(aParts[ji].fillcolor||sFillColor)+";stroke:"+sColor+";stroke-width:1;"+sOpacity+"\">";
               } else {
                  sHTML+="<polygon points=\""+sPoints+"\" style=\"fill:"+(aParts[ji].fillcolor||sFillColor)+";stroke:"+sColor+";stroke-width:1;"+sOpacity+"\">";
               }
               sHTML+="<title>"+sLocationInfo+(aParts[ji].name||"")+" "+((oInObject["service"]||oInObject["name"]||"")+" &#13;"+(oInObject["description"]||""))+" &#13;"+sCableInfo+"</title>";
               sHTML+="</polygon>";
            }
         }
      }
      //Piirretään palvelut
      for(var i=0;i<(oInObject.services||[]).length;i++) {
         sHTML+=doGetSVG4Object(oInObject.services[i]);
      }
      sHTML+="</g>";
   }
   return(sHTML);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doChangeRoleTo(sInRole) {
   sGRole=sInRole;
   $("#user_role").html(sInRole);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doStartWorker(sInObjectId) {
   try {
      if(typeof(Worker) !== "undefined") {
         if (sInObjectId != "") {
            if(typeof(oWebWorkers[sInObjectId]) === "undefined") {
               if(bGUseNewEngine) {
                  oWebWorkers[sInObjectId] = new Worker("static\\doCATSolution2.js?version=1");
               } else {
                  oWebWorkers[sInObjectId] = new Worker("static\\doCATSolution.js?version=91");
                  //For Chrome: oWebWorkers[sInObjectId]=new Worker(URL.createObjectURL(ne Blob(["("+worker_function.toString()+")()"],{type:'text/javascript'})));
                  //Include ww as a <script src=...
                  //Add function worker_function(){all code here} if(window!=self) worker_function();
               }
            }
            oWebWorkers[sInObjectId].onmessage = function (event) {
               var oRespObj={};
               if(typeof event.data === "object") {
                  oRespObj=event.data;
                 $nuxt.$bus.$emit('salesItemsGenerated', { webworkerId: sInObjectId, data: oRespObj.data.salesItemsForUI, objects: oRespObj.data.solution.objects });
                  oGActiveSolution=JSON.parse(JSON.stringify(oRespObj));
                  $("#content").html(JSON.stringify(oRespObj));
                  doUpdateSolutionObjectList(oRespObj);
                  getSolutionObjectList();
                  doUpdateSolutionList();
               } else {
                  oRespObj = JSON.parse(event.data);
                  oGActiveSolution=JSON.parse(JSON.stringify(oRespObj.data.solution));
                  $("#cacheinfo").html(oRespObj.data.ZMODEL_USER_ROLE||"Normal user");
                  if(oRespObj.data.solution.ZCONFIG_ID) oRespObj.data.ZCONFIG_ID=oRespObj.data.solution.ZCONFIG_ID;
                  if(nGAssetFileIndex<nGAssetFileIndexNeeded) {
                     $("#id4shownadcm").attr("style","visibility: visible");
                     nGAssetFileIndex++;
                     if(oRespObj.data.files) {
                        console.log('Webworkerdatafiles',oRespObj.data.files)
                        for(var x in oRespObj.data.files) {
                           if((oRespObj.data.files[x].fileName!="")&&(oRespObj.data.files[x].text!="")) {
                              var location = (oRespObj.data.files[x].fileName || "Bom_import_to_CSP.xml");
                              $("#idcreatedidslist").append("<option>"+location+"</option>");
                              var blobObject = new Blob([oRespObj.data.files[x].text]);
                              window.navigator.msSaveBlob(blobObject, location);
                              $("#sRetObject").val(oRespObj.data.files[x].sobject);//Save Asset file return object!
                           }
                        }
                     }
                     if(oRespObj.data.sFacelayout) {
                        $("#sRetFCObject").val(oRespObj.data.sFacelayout);//Save Asset file return object!
                     }
                     if(nGAssetFileIndex<nGAssetFileIndexNeeded) {
                        var nDoneAlready=0;
                        if(nGAssetFileIndexNeeded>0) nDoneAlready=Math.ceil((nGAssetFileIndex/nGAssetFileIndexNeeded)*100);
                        $("#idprogressbar").attr({"aria-valuenow":nDoneAlready,"style":"width:"+nDoneAlready+"%"}).text(nDoneAlready+"% Ready!");
                        createServerCall();
                     } else {
                        nGAssetFileIndex=0;
                        nGAssetFileIndexNeeded=0;
                        $("#idprogressbar").attr({"aria-valuenow":100,"style":"width:100%","class":"progress-bar progress-bar-success progress-bar-striped"}).text("100% Ready!");
                     }
                  } else {
                     if(oRespObj.meta) {
                        //New API
                        //$("#content").html("<iframe src='' style='border:none;'>"+JSON.stringify(oRespObj)+"</iframe>");
                        var sUIHTML="";
                        if(oRespObj.data) {
                           for(var kk=0;kk<oRespObj.data.length;kk++) {
                              if((oRespObj.data[kk].type||"").toUpperCase()=="ATTRIBUTE") {
                                 if((oRespObj.data[kk].selector||"").toUpperCase()=="SELECT") {
                                    sUIHTML+='<div class="form-group">';
                                    sUIHTML+= '<label for="sel1">Select list:</label>';
                                    sUIHTML+= '<select class="form-control" id="'+oRespObj.data[kk].id+'">';
                                    for(var nn=0;nn<oRespObj.data[kk].options.length;nn++) {
                                       sUIHTML+=  '<option>'+oRespObj.data[kk].options[nn].indexObj+'</option>';
                                    }
                                    sUIHTML+= '</select>';
                                    sUIHTML+='</div>';
                                 }
                              }
                           }
                        }
                     }
                     var bEiOo=true;
                     for(var x in oGSolutions) {
                        if(oRespObj.data.ZCONFIG_ID==(oGSolutions[x].ZCONFIG_ID||"eiole")) {
                           oGSolutions[x]=JSON.parse(JSON.stringify(oRespObj.data.solution));
                           oGSolutions[x].ZCONFIG_ID=oRespObj.data.ZCONFIG_ID;
                           oGSolutions[x].sHTMLSI=(oRespObj.data.sHTMLSI||"");
                           oGSolutions[x].salesItemsForUI=(oRespObj.data.salesItemsForUI||"");
                           oGSolutions[x].sHTML3D=doShow3D(10,"show3DSlot",false,100,100);
                           oGSolutions[x].oapi=JSON.parse(JSON.stringify(oRespObj.data.oapi));
                           bEiOo=false;
                        }
                     }
                     if(bEiOo) {
                        if(typeof oRespObj.data.ZCONFIG_ID !=='undefined') {
                           var oNewObject=JSON.parse(JSON.stringify(oRespObj.data.solution));
                           oNewObject.ZCONFIG_ID=oRespObj.data.ZCONFIG_ID;
                           oNewObject.sHTMLSI=(oRespObj.data.sHTMLSI||"");
                           oNewObject.salesItemsForUI=(oRespObj.data.salesItemsForUI||"");
                           oNewObject.sHTML3D=doShow3D(10,"show3DSlot",false,100,100);
                           oNewObject.oapi=JSON.parse(JSON.stringify(oRespObj.data.oapi));
                           oGSolutions.push(oNewObject);
                           oGActiveSolution=JSON.parse(JSON.stringify(oNewObject));
                        }
                        doUpdateSolutionList();
                     }
                     var oSolutionObjectPointer={};
                     for(var zzz in oGSolutions) {
                        if((oGSolutions[zzz].ZCONFIG_ID||"?")===(oRespObj.data.ZCONFIG_ID||"??")) {
                           oSolutionObjectPointer=oGSolutions[zzz];
                           bSolutionNotFound=false;
                        }
                     }
                     if(!bGTestMode) {
                        oSolutionObjectPointer.data={};
                        oGActiveSolution = JSON.parse(JSON.stringify(oRespObj.data.solution));
                        oGActiveSolution.data={};
                        doUpdateSolutionObjectList(oRespObj);
                        getSolutionObjectList(oRespObj);
                        var sSelectionList="";
                        if(oRespObj.data.solution.lGSelections) {
                           sSelectionList="<div class=\"list-group\">";
                           for(var z in oRespObj.data.solution.lGSelections) {
                              sSelectionList+="<a href=\"#\" class=\"list-group-item\">"+JSON.stringify(oRespObj.data.solution.lGSelections[z])+"</a>";
                           }
                           sSelectionList+="</div>";
                        }
                        $("#oapi").html((JSON.stringify(oRespObj.data.oapi)||""));
                        if(!bGShowNetworkView) $("#content").html((oRespObj.data.sHTML||""));
                        $("#SalesItemSlot").html(oRespObj.data.sHTMLSI||"");
                        aGPreviousSolutions.push(JSON.parse(JSON.stringify(oRespObj.data.solution)));
                        while(aGPreviousSolutions.length>2) aGPreviousSolutions.shift();
                        doUpdateSolutionList();
                     }
                     if((bGCompare)||(typeof oGCompareToSolution[oRespObj.data.ZCONFIG_ID]!=='undefined')) {
                        var sReport="";
                        var sTxtReport="";
                        var aTestThis=[];
                        var bValidTest=true;
                        var bValidConfiguration=false;
                        sTxtReport+="<div class=\"list-group\">";
                        for(var jyy in oRespObj.data.solution.lGSelections) {
                           sTxtReport+="<a href=\"#\" class=\"list-group-item list-group-item-info\">"+JSON.stringify(oRespObj.data.solution.lGSelections[jyy])+"</a>";
                        }
                        sTxtReport+="</div>";
                        sTxtReport+="<div class=\"list-group\">";
                        oRespObj.data.solution.testEndTime=(new Date().getTime());
                        for(var jj=0;jj<oRespObj.data.solution.objects.length;jj++) {
                           if(typeof oRespObj.data.solution.objects[jj].SI!=='undefined') {
                              //Is this object already there?
                              bGCompare=false;
                              var bNotThere=true;
                              for(var kk=0;kk<aTestThis.length;kk++) {
                                 if(aTestThis[kk].sicode==oRespObj.data.solution.objects[jj].SI) {
                                    //Add qty
                                    aTestThis[kk].qty=parseInt(aTestThis[kk].qty)+parseInt(oRespObj.data.solution.objects[jj].qty||1);
                                    bNotThere=false;
                                 }
                              }
                              if(bNotThere) aTestThis.push({sicode:oRespObj.data.solution.objects[jj].SI,siname:(oRespObj.data.solution.objects[jj].SINAME||oRespObj.data.solution.objects[jj].name),qty:parseInt((oRespObj.data.solution.objects[jj].qty||1))});
                           }
                        }
                        //Are all sales items there compared to testcase?
                        aGCompareToList=[];
                        aGCompareToList=oGCompareToSolution[oRespObj.data.ZCONFIG_ID].compareTo;
                        oGCompareToSolution[oRespObj.data.ZCONFIG_ID].testEndTime=oRespObj.data.solution.testEndTime;
                        for(var zzz in oGSolutions) {
                           if((oGSolutions[zzz].ZCONFIG_ID||"?")===(oRespObj.data.ZCONFIG_ID||"??")) {
                              oGSolutions[zzz].testEndTime=oRespObj.data.solution.testEndTime;
                              oRespObj.data.solution.description=oGSolutions[zzz].description||"";
                              oRespObj.data.solution.testStartTime=oGSolutions[zzz].testStartTime;
                           }
                        }
                        for(var ii=0;ii<aGCompareToList.length;ii++) {
                           for(var jj=0;jj<aTestThis.length;jj++) {
                              if(aGCompareToList[ii].sicode==aTestThis[jj].sicode) {
                                 aGCompareToList[ii].visited=true;
                                 aTestThis[jj].visited=true;
                                 if(parseInt(aGCompareToList[ii].qty)==parseInt(aTestThis[jj].qty)) {
                                    sReport+='<li class="list-group-item list-group-item-success">'+aGCompareToList[ii].sicode+':'+aGCompareToList[ii].qty+' '+aGCompareToList[ii].siname+'</li>';
                                    sTxtReport+='<li class="list-group-item list-group-item-success">'+aGCompareToList[ii].sicode+':'+aGCompareToList[ii].qty+' '+aGCompareToList[ii].siname+' Correct!</li>';
                                 } else {
                                    sReport+='<li class="list-group-item list-group-item-danger">Different qty:s '+aGCompareToList[ii].sicode+':'+aGCompareToList[ii].qty+' found:['+aTestThis[jj].qty+']! '+aGCompareToList[ii].siname+'</li>';
                                    sTxtReport+='<li class="list-group-item list-group-item-danger">Different qty:s '+aGCompareToList[ii].sicode+':'+aGCompareToList[ii].qty+' found:['+aTestThis[jj].qty+']! '+aGCompareToList[ii].siname+'??</li>';
                                    bValidTest=false;
                                 }
                              }
                           }
                        }
                        //Are the some extra sales items?
                        for(var ii=0;ii<aTestThis.length;ii++) {
                           if(typeof aTestThis[ii].visited==='undefined') {
                              sReport+='<li class="list-group-item list-group-item-danger">Extra item:'+aTestThis[ii].sicode+':'+aTestThis[ii].qty+' '+aTestThis[ii].siname+'</li>';
                              sTxtReport+='<li class="list-group-item list-group-item-danger">Extra item:'+aTestThis[ii].sicode+':'+aTestThis[ii].qty+' '+aTestThis[ii].siname+'??</li>';
                              bValidTest=false;
                           }
                        }
                        //Are the missing items?
                        for(var ii=0;ii<aGCompareToList.length;ii++) {
                           if(typeof aGCompareToList[ii].visited==='undefined') {
                              sReport+='<li class="list-group-item list-group-item-danger">Missing item:'+aGCompareToList[ii].sicode+':'+aGCompareToList[ii].qty+' '+aGCompareToList[ii].siname+'</li>';
                              sTxtReport+='<li class="list-group-item list-group-item-danger">Missing item:'+aGCompareToList[ii].sicode+':'+aGCompareToList[ii].qty+' '+aGCompareToList[ii].siname+'??</li>';
                              bValidTest=false;
                           }
                        }
                        sTxtReport+="</div>";
                        $("#testreport").html('<ul class="list-group">'+sReport+'</ul>');
                        var sTestReportInHTML="";
                        var nTCNbr=oRespObj.data.solution.id||"a";
                        sTestReportInHTML='<div id="testreport'+nTCNbr+'id" class="panel-group">';
                        if(bValidTest) {
                           sTestReportInHTML+= '<div class="panel panel-success">';
                        } else {
                           sTestReportInHTML+= '<div class="panel panel-danger">';
                        }
                        sTestReportInHTML+=  '<div class="panel-heading">';
                        sTestReportInHTML+=   '<h4 class="panel-title">';
                        sTestReportInHTML+=    '<a data-toggle="collapse" href="#testreport'+nTCNbr+'">'+oGCompareToSolution[oRespObj.data.ZCONFIG_ID].filename+': '+oGCompareToSolution[oRespObj.data.ZCONFIG_ID].description+" (responce time in milliseconds:"+(oGCompareToSolution[oRespObj.data.ZCONFIG_ID].testEndTime-(oGCompareToSolution[oRespObj.data.ZCONFIG_ID].testStartTime||(new Date().getTime())))+')</a>';
                        sTestReportInHTML+=   '</h4>';
                        sTestReportInHTML+=  '</div>';
                        sTestReportInHTML+=  '<div id="testreport'+nTCNbr+'" class="panel-collapse collapse">';
                        sTestReportInHTML+=   sTxtReport;
                        sTestReportInHTML+=  '</div>';
                        sTestReportInHTML+= '</div>';
                        sTestReportInHTML+='</div>';
                        oRespObj.data.solution.testreport=sTestReportInHTML;
                        oSolutionObjectPointer.testreport=sTestReportInHTML;
                        nTCNbr=nTCNbr+1;
                        for(var zzz in oGSolutions) {
                           if((oGSolutions[zzz].ZCONFIG_ID||"?")===(oRespObj.data.ZCONFIG_ID||"??")) {
                              oGSolutions[zzz].testreport=sTestReportInHTML;
                              oGSolutions[zzz].testresult=bValidTest;
                              bValidConfiguration=oRespObj.data.solution.valid||false;
                           }
                        }
                        if(bValidTest) {
                           if(bValidConfiguration) {
                              $("#"+(oRespObj.data.ZCONFIG_ID||"??")).html("<span class='glyphicon glyphicon-check'></span>");
                           } else {
                              $("#"+(oRespObj.data.ZCONFIG_ID||"??")).html("<span title='Sales item list match but the configuration is not valid????' style='background-color:red;' class='glyphicon glyphicon-check'></span>");
                           }
                        } else {
                           $("#"+(oRespObj.data.ZCONFIG_ID||"??")).html("<span title='Sales item list do not match?' class='glyphicon glyphicon-exclamation-sign'></span>");
                        }
                     }//if((bGCompare)||(typeof oGActiveSolution.testStartTime!=='undefined'))
                     $("#SelectionSlot").html(sSelectionList||"");
                     var sRequirementList="<div class=\"list-group\">",sServiceList="<div class=\"list-group\">";
                     for(var z in oRespObj.data.solution.objects) {
                        if(oRespObj.data.solution.objects[z].requirements) {
                           for(var zz=0;zz<oRespObj.data.solution.objects[z].requirements.length;zz++) {
                              var sStatus="";
                              if((oRespObj.data.solution.objects[z].requirements[zz].capacity||0)>(oRespObj.data.solution.objects[z].requirements[zz].capacityServed||0)) {
                                 sStatus=" list-group-item-danger";
                                 if((oRespObj.data.solution.objects[z].requirements[zz].type||"").toUpperCase()!="STATEMENT") sStatus=" list-group-item-info";
                                 if(typeof oRespObj.data.solution.objects[z].requirements[zz].precondition !== 'undefined') sStatus=" list-group-item-warning";
                                 sRequirementList+="<a href=\"#\" class=\"list-group-item"+sStatus+"\">"+JSON.stringify(oRespObj.data.solution.objects[z].requirements[zz])+"</a>";
                              }
                           }
                        }
                        if(oRespObj.data.solution.objects[z].services) {
                           for(var zz=0;zz<oRespObj.data.solution.objects[z].services.length;zz++) {
                              if(parseFloat(oRespObj.data.solution.objects[z].services[zz].capacityUsed||"0.0")<parseFloat(oRespObj.data.solution.objects[z].services[zz].capacity||"0.0")) {
                                 sServiceList+="<a href=\"#\" class=\"list-group-item list-group-item-success\">"+JSON.stringify(oRespObj.data.solution.objects[z].services[zz])+"</a>";
                              }
                           }
                        }
                     }
                     sRequirementList+="</div>";
                     sServiceList+="</div>";
                     $("#FreeReqSlot").html(sRequirementList);
                     $("#FreeSerSlot").html(sServiceList);
                     if((oRespObj.data.sHTMLSI||"")!="") {
                        $("#solutionsalesitemgroup").show();
                        nGShowIdTxt--;
                        switchSiTxt();
                     } else {
                        $("#solutionsalesitemgroup").hide();
                     }
                     if(oRespObj.data.files) {
                        for(var x in oRespObj.data.files) {
                           if((oRespObj.data.files[x].fileName!="")&&(oRespObj.data.files[x].text!="")) {
                              var location = (oRespObj.data.files[x].fileName || "Bom_import_to_CSP.xml");
                              var blobObject = new Blob([oRespObj.data.files[x].text]);
                              window.navigator.msSaveBlob(blobObject, location);
                           }
                        }
                     }
                     try {
                        document.getElementById("TESObjects").setAttribute("class", "panel panel-warning");
                     } catch(e) {

                     }
                     if((oRespObj.data["-CONSISTENT"] == "T") && (oRespObj.data["-COMPLETE"] == "T")) {
                        try {
                           document.getElementById("TESObjects").setAttribute("class", "panel panel-success");
                        } catch(e) {

                        }
                     }
                     if(oRespObj.data.templates) {
                        oGTemplates=JSON.parse(JSON.stringify(oRespObj.data.templates));
                        $("#sSolTemplates").val(JSON.stringify(oGTemplates));//Save Asset file return object!

                     }
                  }
                  syncStations();
                  if(bGEditMode) doHandleEditMode();
               }
            }
         }
      } else {
         $("#content").html("<div><h4>No Web Worker support</h4></div>");
      }
   } catch(e) {
      nGAssetFileIndexNeeded=0;
      console.log(e.message);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doClearConfigurationKeepTemplates() {
   bGCableRuleCreationMode=false;
   oGActiveSolution={};
   nGAssetFileIndexNeeded=0;
   lGObjectsById={};
   lGObjectsByReqId={};
   lGObjectsBySerId={};
   for (var x in oWebWorkers) {
      if(x==sGSelectedConfigurationID) {
         doStopWorker(oWebWorkers[x]);
         delete oWebWorkers[x];
      }
   }
   for(var x in oGSolutions) {
      if(oGSolutions[x].ZCONFIG_ID==sGSelectedConfigurationID) {
         oGSolutions[x]={"ZCONFIG_ID":sGSelectedConfigurationID};
         break;
      }
   }
   doConfigure(sGSelectedConfigurationID);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doClearConfiguration() {
   bGCableRuleCreationMode=false;
   oGTemplates={};
   oGTemplates=JSON.parse(JSON.stringify(oGLoadedTemplates));
   oGActiveSolution={};
   nGAssetFileIndexNeeded=0;
   lGObjectsById={};
   lGObjectsByReqId={};
   lGObjectsBySerId={};
   for (var x in oWebWorkers) {
      if(x==sGSelectedConfigurationID) {
         doStopWorker(oWebWorkers[x]);
         delete oWebWorkers[x];
      }
   }
   for(var x in oGSolutions) {
      if(oGSolutions[x].ZCONFIG_ID==sGSelectedConfigurationID) {
         oGSolutions[x]={"ZCONFIG_ID":sGSelectedConfigurationID};
         break;
      }
   }
   doConfigure(sGSelectedConfigurationID);
}
//--------------------------------------------------------------------------------------------------------------------------------------------
function doSelectObject(sInObjectID) {
   var xConf = getConfigByID(sGSelectedConfigurationID);
   if(xConf != null) {
      try {
         if(typeof(Worker) !== "undefined") {
            if(sGSelectedConfigurationID != "") {
               if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined') {
                  xConf.data.selectedobjects = [];
                  xConf.data.selectedobjects.push({id:sInObjectID});
                  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
                  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
               }
            }
         }
      } catch(e) {
         document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
      }
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doRemoveSolution(sInSolutionId) {
   for(var noniin in oGSolutions) {
      if(oGSolutions[noniin].ZCONFIG_ID==sInSolutionId) {
         oGSolutions.splice(noniin,1);
         break;
      }
   }
   for (var x in oWebWorkers) {
      if(x==sInSolutionId) {
         doStopWorker(oWebWorkers[x]);
         delete oWebWorkers[x];
      }
   }
   doUpdateSolutionList();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doShowNewAssetFileInTxt()//Testing
{
 var testFile=new AssetFile();
 $("#content").html("<div><h4>Asset file content</h4><div><textarea class='form-control' rows='30' id='testAsset'>"+testFile.getAsXmlWorkbook()+"</textarea></div></div>");
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doShowTestReport() {
   var sTestReport="";
   for(var hhh in oGSolutions) {
      if(typeof oGSolutions[hhh].testreport !=='undefined') {
         sTestReport+="<p>"+(oGSolutions[hhh].testreport)+"</p>";
      }
   }
   $("#content").html("<div><h4>Test report</h4><div>"+sTestReport+"</div></div>");
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doShowModelObjectIn3D(sInObjectName) {
   var oTmpModelObject=doGetModelObjectById(sInObjectName);
   var nViewWidthInPx=$("#show3DSlot").width();
   var nViewHeightInPx=600;
   var sPHTML="";
   if(oTmpModelObject.dimensions) {
      nViewHeightInPx=oTmpModelObject.dimensions.height||600;
   }
   sPHTML+="<svg id=\"svg2\" width=\"100%\" height=\""+nViewHeightInPx+"px\">";
   sPHTML+='<line x1="0" y1="0" x2="0" y2="600" style="stroke:rgb(255,0,0);stroke-width:2" />';
   sPHTML+='<line x1="0" y1="0" x2="10" y2="10" style="stroke:rgb(255,0,0);stroke-width:2" />';
   sPHTML+='<line x1="0" y1="600" x2="'+nViewWidthInPx+'" y2="600" style="stroke:rgb(255,0,0);stroke-width:2" />';
   sPHTML+="</svg>";
   sPHTML+="<div><div>x angle <span class=\"badge\">"+nGxkierto+"</span> y angle <span class=\"badge\">"+nGykierto+"</span>z angle<span class=\"badge\">"+nGzkierto+"</span>Size<span class=\"badge\">"+fGsize.toPrecision(2)+"</span>Show layers<span class=\"badge\">"+nGLayers+"</span>Y shift<span class=\"badge\">"+nGYshift+"</span></div><div class=\"btn-group\">";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxkierto+=10;doShowModelObjectIn3D('"+sInObjectName+"');\">X-angle+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGxkierto-=10;doShowModelObjectIn3D('"+sInObjectName+"');\">X-angle-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGykierto+=10;doShowModelObjectIn3D('"+sInObjectName+"');\">Y-angle+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGykierto-=10;doShowModelObjectIn3D('"+sInObjectName+"');\">Y-angle-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGzkierto+=10;doShowModelObjectIn3D('"+sInObjectName+"');\">Z-angle+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGzkierto-=10;doShowModelObjectIn3D('"+sInObjectName+"');\">Z-angle-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"fGsize+=0.05;doShowModelObjectIn3D('"+sInObjectName+"');\">Size+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"fGsize-=0.05;doShowModelObjectIn3D('"+sInObjectName+"');\">Size-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGLayers++;doShowModelObjectIn3D('"+sInObjectName+"');\">Layers+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGLayers--;doShowModelObjectIn3D('"+sInObjectName+"');\">Layers-</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGYshift+=50;doShowModelObjectIn3D('"+sInObjectName+"');\">Y+</button>";
   sPHTML+="<button type=\"button\" class=\"btn btn-primary\" onclick=\"nGYshift-=50;doShowModelObjectIn3D('"+sInObjectName+"');\">Y-</button>";
   sPHTML+="</div></div>";
   try {
      document.getElementById("show3DSlot").innerHTML=sPHTML;
   } catch(e) {
      console.log("SVG creation problem?:"+e.message);
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function removeObjectFromModelByName(sInModelObjectName) {
   for(var x in oGActiveModel.objects) {
      if(oGActiveModel.objects[x].name == sInModelObjectName) {
         oGActiveModel.objects.splice(x,1);
         break;
      }
   }
   doUpdateModelObjectList();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doAddNewModelObject(oInObject) {
   if(typeof oInObject!=='undefined'){
      if(typeof oInObject.name==='undefined') oInObject.name="New object "+(oGActiveModel.objects.length+1);
      oGActiveModel.objects.push(JSON.parse(JSON.stringify(oInObject)));
   } else {
      oGActiveModel.objects.push(JSON.parse(JSON.stringify({name:"New object "+(oGActiveModel.objects.length+1)})));
   }
   doUpdateModelObjectList();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doCopyModelObjectByName(sInObjectName) {
   var oCopyObject=JSON.parse(JSON.stringify(doGetModelObjectById(sInObjectName)));
   oCopyObject.name="Copy of "+oCopyObject.name;
   oGActiveModel.objects.push(oCopyObject);
   doUpdateModelObjectList();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doSetObject(sInObjectName,sObjectTxt){
   try{
      for(var i=0;i<oGActiveModel.objects.length;i++) {
         if(oGActiveModel.objects[i].name==sInObjectName) {
            oGActiveModel.objects[i]=JSON.parse($("#"+sObjectTxt).val());
            $("#"+sObjectTxt+"error").html("<div class='alert alert-success'>Saved!</div>");
         }
      }

   } catch(errori){$("#"+sObjectTxt+"error").html("<div class='alert alert-danger'>"+errori.toString()+"</div>");}
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doImportFile(sFileLocation) {
   var sHTML="";
   $("li").removeClass("active");
   $("#importcommand").attr("Class","active");
   if(sFileLocation=="") {
      $("#content").html("<div><h4>Locate the JSON file(s) and press import to start</h4><form role='search' name='fileHandling' action='javascript:doImportFile(document.fileHandling)'><div class='form-group'><input class='form-control' placeholder='Search' name='tcs[]' id='tcs' type='file' multiple='true' /><button class='btn btn-default' type='submit'>Import</button></div><span id='listfiles'/></form>");
   } else {
      if(sFileLocation.tcs.files.length>0) {
         for (var x in oWebWorkers) {
            doStopWorker(oWebWorkers[x]);
         }
         var reader,tmpni;
         sHTML+="<div id='importlist'><h2>Importing</h2><p>Importing file(s):</p><div class='list-group'>";
         for(tmpni=0;tmpni<sFileLocation.tcs.files.length;tmpni++) {
            sHTML+="<a id='fle"+tmpni+"' href='#' title='Success' class='list-group-item list-group-item-danger'>"+sFileLocation.tcs.files[tmpni].name+"</a>";
         }
         sHTML+="</div><p>Note! The file list item is red if the import fails - green for successful import.</p><textarea id='doShowLastContent' rows='80' cols='100'></textarea><div><p id='errorid'></p></div></div>";
         $("#listfiles").html(sHTML);
         for(tmpni=0;tmpni<sFileLocation.tcs.files.length;tmpni++) {
            if(sFileLocation.tcs.files[tmpni].name.toString().lastIndexOf(".json")>0) {
               reader=new FileReader();
               reader.onload=(function(theFile,inIndex) {
                  return function(e) {
                     $("#doShowLastContent").html(e.target.result);
                     var stmpFileName="Imported file "+inIndex;
                     try {
                        stmpFileName=theFile.name.toString();
                     } catch(e) {}
                     var tmpli=stmpFileName.lastIndexOf("\\");
                     var sCFGfilePath="";
                     var sModelName="";
                     if((tmpli>0)&&(tmpli<stmpFileName.length)) {
                        sCFGfilePath=stmpFileName.slice(0,tmpli+1);
                        stmpFileName=stmpFileName.replace(sCFGfilePath,"");
                     }
                     try {
                        var otmpObj=JSON.parse(e.target.result);
                        var bSolution=false,bTestCase=false,bProject=false;
                        var oProject={solutions:[]};
                        try {
                           if((otmpObj.type||"Model").toUpperCase()=="PROJECT") {
                              bProject=true;
                              bSolution=true;
                           }
                           if((otmpObj.type||"Model").toUpperCase()=="SOLUTION") bSolution=true;
                           if((otmpObj.type||"Model").toUpperCase()=="TESTCASE") {
                              bProject=false;
                              bSolution=true;
                              bTestCase=true;
                           }
                        } catch(e) {
                           console.log("File import error:"+e.message);
                        }
                        if(bSolution) {
                           var sFirstConfigurationId="";
                           var sImportList=$("#importlist").html();
                           if(bProject){
                              oProject=JSON.parse(JSON.stringify(otmpObj));
                           } else {
                              oProject.solutions.push(JSON.parse(JSON.stringify(otmpObj)));
                           }
                           for(var j=0;j<oProject.solutions.length;j++){
                              oGActiveSolution=JSON.parse(JSON.stringify(oProject.solutions[j]));
                              if(oProject.solutions[j].templates) oGTemplates=JSON.parse(JSON.stringify(oProject.solutions[j].templates));
                              if(bTestCase) {
                                 bGCompare=true; bGTestMode=true;
                                 aGCompareToList.splice(0,aGCompareToList.length);
                                 for(var xxx in oGActiveSolution.objects) {
                                    if((oGActiveSolution.objects[xxx].SI||"")!="") {
                                       var sSI=(oGActiveSolution.objects[xxx].SI||"");
                                       var sSIName=(oGActiveSolution.objects[xxx].SINAME||oGActiveSolution.objects[xxx].name||"");
                                       var sSIQty=(oGActiveSolution.objects[xxx].qty||"1");
                                       var bJes=false;
                                       for(var ii=0;ii<aGCompareToList.length;ii++) {
                                          if(aGCompareToList[ii].sicode==sSI) {
                                             bJes=true;
                                             aGCompareToList[ii].qty=(parseInt(aGCompareToList[ii].qty)+parseInt(sSIQty)).toString();
                                          }
                                       }
                                       if(!bJes) aGCompareToList.push({sicode:sSI,siname:sSIName,qty:sSIQty});
                                    }
                                 }
                              }
                              oGActiveSolution.testStartTime=new Date().getTime();
                              oGActiveSolution.compareTo=JSON.parse(JSON.stringify(aGCompareToList));
                              nWWindex++;
                              sGSelectedConfigurationID="S"+("1234567891"+((new Date()).getTime()).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(nGSC++).toString()).substr(-11,11);
                              oGActiveSolution.ZCONFIG_ID=sGSelectedConfigurationID;
                              if(bTestCase) {
                                 oGActiveSolution.name=(stmpFileName||"Solution").replace(".json","");
                                 oGCompareToSolution[sGSelectedConfigurationID]={};
                                 oGCompareToSolution[sGSelectedConfigurationID].testStartTime=new Date().getTime();
                                 oGCompareToSolution[sGSelectedConfigurationID].compareTo=JSON.parse(JSON.stringify(aGCompareToList));
                                 oGCompareToSolution[sGSelectedConfigurationID].description=oGActiveSolution.description;
                                 oGCompareToSolution[sGSelectedConfigurationID].filename=stmpFileName.replace(sCFGfilePath,"");
                              }
                              oGSolutions.push(JSON.parse(JSON.stringify(oGActiveSolution)));
                              if(sFirstConfigurationId=="") sFirstConfigurationId=sGSelectedConfigurationID;
                              doConfigure(sGSelectedConfigurationID);
                           }
                           sGSelectedConfigurationID=sFirstConfigurationId;
                           $("#fle"+inIndex).attr("class","list-group-item list-group-item-success");
                        } else {//Model
                           oGActiveModel=JSON.parse(e.target.result);

                           for(var x=0;x<oGActiveModel.objects.length;x++) {
                              lGModelObjectsByName[(oGActiveModel.objects[x].name||"No name?")]=oGActiveModel.objects[x];
                           }
                           for(var x=0;x<oGActiveModel.objects.length;x++) {
                              if(typeof oGActiveModel.objects[x].extends!=='undefined') doInheritance4(oGActiveModel.objects[x]);
                           }
                           $("#fle"+inIndex).attr("class","list-group-item list-group-item-success");
                           doUpdateModelObjectList();
                           $("#configurecommand").show();
                        }
                     } catch(err) {
                        $("#errorid").html(err.message);
                     }
                     doUpdateSolutionList();
                  }
               })(sFileLocation.tcs.files[tmpni],tmpni);
               reader.readAsText(sFileLocation.tcs.files[tmpni]);
            }
            if(sFileLocation.tcs.files[tmpni].name.toString().lastIndexOf(".cml2")>0) {
     reader=new FileReader();
     reader.onload=(function(theFile,inIndex)
     {
      return function(e)
      {
       $("#doShowLastContent").html(e.target.result);
       var stmpFileName="Imported file "+inIndex;
       try{stmpFileName=theFile.name.toString();}catch(e){}
       var tmpli=stmpFileName.lastIndexOf("\\");
       var sCFGfilePath="";
       if((tmpli>0)&&(tmpli<stmpFileName.length))
       {
        sCFGfilePath=stmpFileName.slice(0,tmpli+1);
        stmpFileName=stmpFileName.replace(sCFGfilePath,"");
       }
       try
       {
	     var otmpObj=doParseCML2(e.target.result);
	     var sImportList=$("#importlist").html();
        oGActiveModel=JSON.parse(JSON.stringify(otmpObj));
        $("#fle"+inIndex).attr("class","list-group-item list-group-item-success");
        $("#doShowLastContent").html(otmpObj.notes||"");
        doUpdateModelObjectList();
        $("#configurecommand").show();
       }
       catch(err)
       {
        $("#errorid").html(err.message);
       }
      }
     })(sFileLocation.tcs.files[tmpni],tmpni);
     reader.readAsText(sFileLocation.tcs.files[tmpni]);
    }
    if(sFileLocation.tcs.files[tmpni].name.toString().lastIndexOf(".cmlui")>0)
    {
     reader=new FileReader();
     reader.onload=(function(theFile,inIndex)
     {
      return function(e)
      {
       $("#doShowLastContent").html(e.target.result);
       var stmpFileName="Imported file "+inIndex;
       try{stmpFileName=theFile.name.toString();}catch(e){}
       var tmpli=stmpFileName.lastIndexOf("\\");
       var sCFGfilePath="";
       if((tmpli>0)&&(tmpli<stmpFileName.length))
       {
        sCFGfilePath=stmpFileName.slice(0,tmpli+1);
        stmpFileName=stmpFileName.replace(sCFGfilePath,"");
       }
       try
       {
	     var otmpObj=doParseFromCMLui(e.target.result);
	     var sImportList=$("#importlist").html();
        oGActiveModel.objects.push(JSON.parse(JSON.stringify(otmpObj)));
        $("#fle"+inIndex).attr("class","list-group-item list-group-item-success");
        doUpdateModelObjectList();
        $("#doShowLastContent").html(otmpObj.notes||"");
        $("#configurecommand").show();
       }
       catch(err)
       {
        $("#errorid").html(err.message);
       }
      }
     })(sFileLocation.tcs.files[tmpni],tmpni);
     reader.readAsText(sFileLocation.tcs.files[tmpni]);
    }
    else if(sFileLocation.tcs.files[tmpni].name.toString().lastIndexOf(".xml")>0)
    {
     reader=new FileReader();
     reader.onload=(function(theFile,inIndex)
     {
      return function(e)
      {
       xmlDoc=initXML(e.target.result);
       var bOK=false;
       var lLoadedSelections=[];
       var sAssetId="";
       var sModelVersion="";
       var nLoadedTemplates=0;
       oGActiveSolution={'objects':[]};
       try
       {
        var z=xmlDoc.getElementsByTagName("Worksheet");
        for(var x=0;x<z.length;x++)
        {
         if((z[x].getAttribute("ss:Name")||"").toString()=="Selections")
         {
          for(var y=0;y<z[x].getElementsByTagName("Data").length;y++)
          {
           var sText=z[x].getElementsByTagName("Data")[y].text||"";
           if(sText.indexOf("Selections:")>=0)
           {
  	         if(oGActiveModel.objects)
            {
   	       bOK=true;
	         }
           }
           else if(sText.indexOf("{")>=0)
	        {//Get selections
	         try{lLoadedSelections.push(JSON.parse(sText));}catch(er){console.log(er.message);}
	        }
	        else if(sText.indexOf("Asset id:")>=0)
           {//Take asset id
            try{sAssetId=((sText.split(":"))[1]).replace(/\s/,'');}catch(er){console.log(er.message);}
	        }
           else if(sText.indexOf("Model version:")>=0)
           {//Take model db version
	         try{sModelVersion=((sText.split(":"))[1]).replace(/\s/,'');}catch(er){console.log(er.message);}
	        }
           else if(sText.indexOf("Model name:")>=0)
           {//Take model name
	         try{sModelName=((sText.split(":"))[1]).replace(/\s/,'');}catch(er){console.log(er.message);}
	        }
	       }
	      }
	      if((z[x].getAttribute("ss:Name")||"").toString()=="Configuration")
         {
	       bOK=false;
	       for(var y=0;y<z[x].getElementsByTagName("Data").length;y++)
	       {
	        var sText=z[x].getElementsByTagName("Data")[y].text||"";
           if(sText.indexOf("Configuration:")>=0)
           {
	         bOK=true;
           }
           else if(sText.indexOf("{")>=0)
	        {//Get solution.objects[]
	         try{oGActiveSolution.objects.push(JSON.parse(sText));}catch(e){bOK=false;}
	        }
	       }
	      }
	      if((z[x].getAttribute("ss:Name")||"").toString()=="Equipment BOM (IMPORT)")
         {
          bGCompare=true;aGCompareToList.splice(0,aGCompareToList.length);
          oGActiveSolution.testStartTime=new Date().getTime();
          for(var nRow=1;nRow<z[x].getElementsByTagName("Row").length;nRow++)
          {
	        var otmprow=z[x].getElementsByTagName("Row")[nRow];
	        var otmp=otmprow.getElementsByTagName("Data");
	        if((otmp[0].text||"")=="2")
	        {
	         var sSI=(otmp[3].text||"");
	         var sSIName=(otmp[4].text||"");
            var sSIQty=(otmp[5].text||"");
	         aGCompareToList.push({sicode:sSI,siname:sSIName,qty:sSIQty});
	        }
	       }
	      }
         if((z[x].getAttribute("ss:Name")||"").toString()=="Templates")
         {
          bOK=false;
          oGLoadedTemplates=[];
          //get by row
          for(var nrows=0;nrows<z[x].getElementsByTagName("Row").length;nrows++)
          {
           var sText="";
           for(var y=0;y<z[x].getElementsByTagName("Row")[nrows].getElementsByTagName("Data").length;y++)
           {
            sText=sText+(z[x].getElementsByTagName("Row")[nrows].getElementsByTagName("Data")[y].text||"");
           }
           if(sText.indexOf("Templates:")>=0)
           {
  	         if(oGActiveModel.objects)
            {
   	       bOK=true;
	         }
           }
           else if(sText!="")
	        {//Get selections
            try{oGLoadedTemplates.push(JSON.parse(tmpdecode(sText)));}catch(e){bOK=false;}
            nLoadedTemplates++;
	        }
           else if(sText.indexOf("Asset id:")>=0)
	        {//Take asset id
	        }
           else if(sText.indexOf("Model version:")>=0)
           {//Take model db version
	        }
           else if(sText.indexOf("Model name:")>=0)
           {//Take model name
           }
          }//for(var nrows=0;nrows<z[x].getElementsByTagName("Row").length;nrows++)
	      }//if((z[x].getAttribute("ss:Name")||"").toString()=="Templates")
	     }//for(var x=0;x<z.length;x++)
        if(bOK)
	     {
	      $("#fle"+inIndex).attr("class","list-group-item list-group-item-success");
	      if((lLoadedSelections.length>0)||(nLoadedTemplates>0))
	      {
	       doClearConfiguration();
          oGLoadedTemplates=[];
          doConfigure(sGSelectedConfigurationID);
          doSetUpConfiguration(lLoadedSelections,sAssetId);
         }
	     }
       }
       catch(err)
       {
	     console.log("doImportFile: "+err.message);
       }
      };
     })(sFileLocation.tcs.files[tmpni],tmpni);
     reader.readAsText(sFileLocation.tcs.files[tmpni]);
            }	else if(sFileLocation.tcs.files[tmpni].name.toString().lastIndexOf(".xlsx")>0) {
               if((typeof sFileLocation)==='string'){
                  tmpfname=sFileLocation;
               }else{
                  tmpfname=sFileLocation[0].value.toString().split(", ")[tmpni];
               }
               doReadFromExcel2Conf(tmpfname);
               $("#fle"+tmpni).attr("class","list-group-item list-group-item-success");
            } else if(sFileLocation.tcs.files[tmpni].name.toString().lastIndexOf(".csv")>0) {
               if((typeof sFileLocation)==='string'){
                  tmpfname=sFileLocation;
               }else{
                  tmpfname=sFileLocation[0].value.toString().split(", ")[tmpni];
               }
               reader=new FileReader();
               reader.onload=(function(theFile,inIndex) {
                  return function(e) {
                     $("#doShowLastContent").html(e.target.result);
                     var stmpFileName="Imported file "+inIndex;
                     try{stmpFileName=theFile.name.toString();}catch(e){}
                     var tmpli=stmpFileName.lastIndexOf("\\");
                     var sCFGfilePath="";
                     if((tmpli>0)&&(tmpli<stmpFileName.length)) {
                        sCFGfilePath=stmpFileName.slice(0,tmpli+1);
                        stmpFileName=stmpFileName.replace(sCFGfilePath,"");
                     }
                     try {
                        var sFirstConfigurationId="",sAlreadyCreatedStation="";
                        var lList=(e.target.result||"").split("\n");
                        for(var nIndex=1;nIndex<lList.length;nIndex++){
                           var lCols=(lList[nIndex]||"").split(";");
                           if((lCols[0]||"")!=""){
                              if(sAlreadyCreatedStation.indexOf("["+lCols[0]+"]")<0){
                                 sAlreadyCreatedStation+="["+lCols[0]+"]";
                                 oGActiveSolution=JSON.parse(JSON.stringify({"name":"Station","objects":[]}));
                                 sGSelectedConfigurationID="S"+("1234567891"+((new Date()).getTime()).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(nGSC++).toString()).substr(-11,11);
                                 oGActiveSolution.ZCONFIG_ID=sGSelectedConfigurationID;
                                 oGActiveSolution.name=lCols[0]||"Station";
                                 oGSolutions.push(JSON.parse(JSON.stringify(oGActiveSolution)));
                                 if(sFirstConfigurationId=="") sFirstConfigurationId=sGSelectedConfigurationID;
                                 doConfigure(sGSelectedConfigurationID);
                                 //bGShowNetworkView=true;
                                 //addObject2SolutionByName('Link',1, '');
                              }
                           }
                        }
                        /*
                        for(var nIndex=1;nIndex<lList.length;nIndex++){
                           var lCols=(lList[nIndex]||"").split(";");
                           if(((lCols[0]||"")!="")&&((lCols[1]||"")!="")){
                              if(sAlreadyCreatedStation.indexOf("["+lCols[0]+"]")<0){
                                 sAlreadyCreatedStation+="["+lCols[0]+"]";
                                 oGActiveSolution=JSON.parse(JSON.stringify({"name":"Station","objects":[]}));
                                 sGSelectedConfigurationID="S"+("1234567891"+((new Date()).getTime()).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(nGSC++).toString()).substr(-11,11);
                                 oGActiveSolution.ZCONFIG_ID=sGSelectedConfigurationID;
                                 oGActiveSolution.name=lCols[0]||"Station";
                                 oGSolutions.push(JSON.parse(JSON.stringify(oGActiveSolution)));
                                 if(sFirstConfigurationId=="") sFirstConfigurationId=sGSelectedConfigurationID;
                                 doConfigure(sGSelectedConfigurationID);
                              }
                           }
                        }*/
                        sGSelectedConfigurationID=sFirstConfigurationId;
                        $("#fle"+inIndex).attr("class","list-group-item list-group-item-success");
                        $("#configurecommand").show();
                     } catch(err) {
                        $("#errorid").html(err.message);
                     }
                  }
               })(sFileLocation.tcs.files[tmpni],tmpni);
               reader.readAsText(sFileLocation.tcs.files[tmpni]);
            }
         }
      }
      //document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doReadFromCSV2Conf(Infname) {
   if(Infname) {
      var sConv="";
      var tmpExcel=new ActiveXObject("Excel.Application");
      var tmpBook=tmpExcel.Workbooks.Open(Infname);
      var tmpSheet=tmpBook.Sheets(1);
      var nRowNbr=2;
      var nColNbr=1;
      var nMaxColQty=0;
      var oObject=[];
      var sRange="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB";
      var sFirstColumnName=tmpSheet.Range("A1").Text;
      var aCols=sRange.split(",");
      for(var i=0;i<aCols.length;i++) {
         if(tmpSheet.Range((aCols[i]).toString()+"1").Text!="") nMaxColQty++;
      }
      while(tmpSheet.Range("A"+(nRowNbr)).Text!="") {
         var oLink={"add":"Link","imported":{}};
         oLink.imported["name"]=tmpSheet.Range("A"+(nRowNbr)).Text+" to "+tmpSheet.Range("B"+(nRowNbr)).Text;
         oLink.imported["code"]=(tmpSheet.Range("A"+(nRowNbr)).Text+tmpSheet.Range("B"+(nRowNbr)).Text).replace(/\s/,'');
         for(var i=0;i<nMaxColQty;i++) {
            oLink.imported[tmpSheet.Range((aCols[i]).toString()+"1").Text]=tmpSheet.Range((aCols[i]).toString()+(nRowNbr).toString()).Text;
         }
         doPostMessage(JSON.parse(JSON.stringify(oLink)));
         nRowNbr++;
         nRowNbr++;
      }
      if(Infname)
      {
         tmpExcel.Quit();
         tmpExcel=null;
         idForCleaning=window.setInterval("doCleanUp();",1);
      }
   }
   doUpdateSolutionList();
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doExportTC(sInDescription) {
   if(sInDescription=='ShowDescriptionInputPage') {
      var sHTML="";
      sHTML+='<div class="form-group">';
      sHTML+= '<label for="comment">Test case description:</label>';
      sHTML+= '<textarea class="form-control" rows="5" id="tccomment"></textarea>';
      sHTML+= "<button type='button' class='btn' onclick='doExportTC($(\"#tccomment\").val())'>Save</button>";
      sHTML+= "&nbsp;";
      sHTML+= "<button type='button' class='btn' onclick='doActivateConf()'>Cancel</button>";
      sHTML+='</div>';
      document.getElementById("content").innerHTML=sHTML;
   } else {
      var today=new Date();
      var min=today.getMinutes();
      var hr=today.getHours();
      var dd=today.getDate();
      var mm=today.getMonth()+1;
      var yyyy=today.getFullYear();
      var dateTime=yyyy+"_"+mm+"_"+dd+"_"+hr+"_"+min;
      var location="TC_"+dateTime+".json";
      oGActiveSolution.type="Testcase";
      oGActiveSolution.description=sInDescription;
      oGActiveSolution.templates=oGTemplates;
      document.getElementById("content").innerHTML="JSON export file content created.";
      try {
         var blobObject=new Blob([JSON.stringify(oGActiveSolution)]);
         window.navigator.msSaveBlob(blobObject,location);
      } catch(e) {
         document.getElementById("content").innerHTML="JSON export file content created.<br/>The browser do not support file saving?<br/>"+e.message;
      }
   }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function initXML(sInOptionalString) {
   var tmpxlsDoc;
   if(window.ActiveXObject!==undefined) {
      tmpxlsDoc = new ActiveXObject("Microsoft.XMLDOM");
      if(sInOptionalString!="") {
         tmpxlsDoc.loadXML(sInOptionalString);
      }
   }else if(document.implementation && document.implementation.createDocument) {
      tmpxlsDoc = document.implementation.createDocument("", "", null);
      if(sInOptionalString!="") {
         if(window.DOMParser) {
            parser=new DOMParser();
            tmpxlsDoc=parser.parseFromString(sInOptionalString,"text/xml");
         } else {
            alert('Your browser cannot initialize XML-object?');
            return;
         }
      }
   } else {
      alert('Your browser cannot initialize XML-object?');
      return;
   }
   tmpxlsDoc.async=false;
   return tmpxlsDoc;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
function _utf8_decode(utftext)
{
 var string = "", i = 0, c = 0, c1 = 0, c2 = 0;
 while ( i < utftext.length )
 {
  c = utftext.charCodeAt(i);
  if (c < 128)
  {
   string += String.fromCharCode(c);
   i++;
  }
  else if((c > 191) && (c < 224))
  {
   c1 = utftext.charCodeAt(i+1);
   string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
   i += 2;
  }
  else
  {
   c1 = utftext.charCodeAt(i+1);
   c2 = utftext.charCodeAt(i+2);
   string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
   i += 3;
  }
 }
 return string;
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------
function tmpdecode(input)
{
 var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
 var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
 input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 while (i < input.length)
 {
  enc1 = _keyStr.indexOf(input.charAt(i++));
  enc2 = _keyStr.indexOf(input.charAt(i++));
  enc3 = _keyStr.indexOf(input.charAt(i++));
  enc4 = _keyStr.indexOf(input.charAt(i++));
  chr1 = (enc1 << 2) | (enc2 >> 4);
  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
  chr3 = ((enc3 & 3) << 6) | enc4;
  output += String.fromCharCode(chr1);
  if(enc3!==64){output+=String.fromCharCode(chr2);}
  if(enc4!==64){output+=String.fromCharCode(chr3);}
 }
 return _utf8_decode(output);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------
function doReadFromExcel2Conf(Infname) {
   if(Infname) {
      var sConv="";
      var tmpExcel=new ActiveXObject("Excel.Application");
      var tmpBook=tmpExcel.Workbooks.Open(Infname);
      var tmpSheet=tmpBook.Sheets(1);
      var nRowNbr=2;
      var nColNbr=1;
      var nMaxColQty=0;
      var oObject=[];
      var sRange="A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,AB";
      var sFirstColumnName=tmpSheet.Range("A1").Text;
      var aCols=sRange.split(",");
      for(var i=0;i<aCols.length;i++) {
         if(tmpSheet.Range((aCols[i]).toString()+"1").Text!="") nMaxColQty++;
      }
      while(tmpSheet.Range("A"+(nRowNbr)).Text!="") {
         var oLink={"add":"Link","imported":{}};
         oLink.imported["name"]=tmpSheet.Range("A"+(nRowNbr)).Text+" to "+tmpSheet.Range("B"+(nRowNbr)).Text;
         oLink.imported["code"]=(tmpSheet.Range("A"+(nRowNbr)).Text+tmpSheet.Range("B"+(nRowNbr)).Text).replace(/\s/,'');
         for(var i=0;i<nMaxColQty;i++) {
            oLink.imported[tmpSheet.Range((aCols[i]).toString()+"1").Text]=tmpSheet.Range((aCols[i]).toString()+(nRowNbr).toString()).Text;
         }
         doPostMessage(JSON.parse(JSON.stringify(oLink)));
         nRowNbr++;
         nRowNbr++;
      }
      if(Infname)
      {
         tmpExcel.Quit();
         tmpExcel=null;
         idForCleaning=window.setInterval("doCleanUp();",1);
      }
   }
   doUpdateSolutionList();
}







function switchSiTxt() {
   nGShowIdTxt++;
   if(nGShowIdTxt>3) {
      nGShowIdTxt=0;
      if(sGStoreSIHTML != "") {
         $("#solutionsalesitemgroup").html(sGStoreSIHTML);
         sGStoreSIHTML = "";
      }
   }
   if(nGShowIdTxt==3) {
      //Show PCI/SI data
      var aPCIList=[],aSIDescr=[],aShort=[],sPCISIhtml="";
      sGStoreSIHTML = $("#solutionsalesitemgroup").html();
      for (var x in oGActiveSolution.objects) {
         if(oGActiveSolution.objects[x]["SI"]) {
            if(oGActiveSolution.objects[x].extended === undefined) {
               if(oGActiveSolution.objects[x]["PCI"]) {
                  if(oGActiveSolution.objects[x].name) aSIDescr[oGActiveSolution.objects[x]["SI"]] = oGActiveSolution.objects[x].SINAME||oGActiveSolution.objects[x].name;
                  if(oGActiveSolution.objects[x]["short"]) aShort[oGActiveSolution.objects[x]["SI"]] = oGActiveSolution.objects[x]["short"];
                  if(aPCIList[oGActiveSolution.objects[x]["PCI"]]) {
                     aPCIList[oGActiveSolution.objects[x]["PCI"]].push(oGActiveSolution.objects[x]["SI"]);
                  } else {
                     aPCIList[oGActiveSolution.objects[x]["PCI"]] = [];
                     aPCIList[oGActiveSolution.objects[x]["PCI"]].push(oGActiveSolution.objects[x]["SI"]);
                  }
               }
            }
         }
      }
      sPCISIhtml = "<ul class='list-group'>";
      for (var x in aPCIList) {
         sPCISIhtml += "<li class='list-group-item list-group-item-info'>" + x + "</li>";
         var aQtyList = [];
         for (var y in aPCIList[x]) {
            if(aQtyList[aPCIList[x][y]]) {
               aQtyList[aPCIList[x][y]]++;
            } else {
               aQtyList[aPCIList[x][y]] = 1;
            }
         }
         for (var y in aQtyList) {
            if (aSIDescr[y]) {
               sPCISIhtml += "<li class='list-group-item' onClick=\"switchSiTxt()\"><span class='badge'>" + aQtyList[y] + "</span>" + y + " " + aSIDescr[y].replace(/\,/, "").replace(" (Server)", "").replace(" (Control)", "").replace(" (Spine)", "").replace(" (Z9100)", "") + "</li>";
            } else {
               sPCISIhtml += "<li class='list-group-item' onClick=\"switchSiTxt()\"><span class='badge'>" + aQtyList[y] + "</span>" + y + "</li>";
            }
         }
      }
      sPCISIhtml += "</ul>";
      $("#solutionsalesitemgroup").html("<div class=\"panel panel-default\"><div class=\"panel-heading\" onClick=\"switchSiTxt()\">PCI-SI mapping</div><div class=\"panel-body\">" + sPCISIhtml + "</div></div>");
   } else {
      var cItems=document.getElementsByClassName("salesitem");
      for(var j=0;j<cItems.length;j++) {
         if((cItems[j].hasAttribute("txt"))&&(cItems[j].hasAttribute("si"))) {
            switch(nGShowIdTxt) {
               case 0:cItems[j].innerHTML=cItems[j].getAttribute("si");
               break;
               case 1:cItems[j].innerHTML=cItems[j].getAttribute("txt");
               break;
               case 2:cItems[j].innerHTML=(cItems[j].getAttribute("si")+" / "+cItems[j].getAttribute("txt"));
               break;
               default:cItems[j].innerHTML=cItems[j].getAttribute("si");
            }
         }
      }
   }
}



function doExportSU() {
   var today=new Date();
   var min=today.getMinutes();
   var hr=today.getHours();
   var dd=today.getDate();
   var mm=today.getMonth()+1;
   var yyyy=today.getFullYear();
   var dateTime=yyyy+"_"+mm+"_"+dd+"_"+hr+"_"+min;
   var location="Solution_"+dateTime+".json";
   oGActiveSolution.type="Solution";
   oGActiveSolution.templates=oGTemplates;
   document.getElementById("content").innerHTML="JSON export file content created.";
   try {
      var blobObject=new Blob([JSON.stringify(oGActiveSolution)]);
      window.navigator.msSaveBlob(blobObject,location);
   } catch(e) {
      document.getElementById("content").innerHTML="JSON export file content created.<br/>The browser do not support file saving?<br/>"+e.message;
   }
}
//--------------------------------------------------------------------------------------------------------------------------------------------
function doExportBU() {
   var today=new Date();
   var min=today.getMinutes();
   var hr=today.getHours();
   var dd=today.getDate();
   var mm=today.getMonth()+1;
   var yyyy=today.getFullYear();
   var dateTime=yyyy+"_"+mm+"_"+dd+"_"+hr+"_"+min;
   var sDateTime=(("00"+dd).toString()).substr(-2,2)+"/"+(("00"+mm).toString()).substr(-2,2)+"/"+yyyy+" "+(("00"+hr).toString()).substr(-2,2)+":"+(("00"+min).toString()).substr(-2,2);
   var location="Objects_"+dateTime+".json";
   document.getElementById("content").innerHTML="JSON export file content created.";
   oGActiveModel.modified=sDateTime;
   try {
      var blobObject=new Blob([JSON.stringify(oGActiveModel)]);
      window.navigator.msSaveBlob(blobObject,location);
   } catch(e) {
      document.getElementById("content").innerHTML="JSON export file content created.<br/>The browser do not support file saving?<br/>"+e.message;
   }
}
//--------------------------------------------------------------------------------------------------------------------------------------------

function CAT(introData) {
	introData = introData || {};
	this.data = {
		"-VERSION": introData["-VERSION"] || "",
		"-DESCR": introData["-DESCR"] || "",
		"-DATE": introData["-DATE"] || "",
		"Scenarios": introData["Scenarios"] || {
			"SCENARIO": []
		}
	};
}

function Scenario(introData) {
	introData = introData || {};
	this.data = {
		"-NR": introData["-NR"] || "",
		"-DESCR": introData["-DESCR"] || "",
		"Phases": introData["Phases"] || {
			"PHASE": []
		}
	};
}

function createServers(nInQty,sInCMN)
{
 var sHTML="";
 if(nInQty>0)
 {
  nGAssetFileIndexNeeded=parseInt(nInQty);
  nGAssetFileIndex=0;
  sGCMN=sInCMN;
  sHTML='<h2>Creating '+parseInt(nInQty)+' asset '+(parseInt(nInQty)>1 ? 'files':'file')+' '+(sInCMN!="" ? "for CMN "+sInCMN:"")+'</h2>';
  sHTML+='<div class="progress">';
  sHTML+= '<div id="idprogressbar" class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:0%">0%</div>';
  sHTML+='</div>';
  sHTML+="<button onclick='nGAssetFileIndexNeeded=0;$(\"#idprogressbar\").attr({\"class\":\"progress-bar progress-bar-danger\"}).text(\"Cancelled!\");' type='button' class='btn btn-default'>Cancel Asset file creation</button>";
  sHTML+='<br/><br/><div class="form-group">';
  sHTML+='<label for="sel2">Generated asset file id(s):</label>';
  sHTML+='<fieldset disabled><select id="idcreatedidslist" class="form-control" size="8">';
  sHTML+='</select></fieldset>';
  sHTML+="<button onclick='doExportAssetIDlist();' type='button' title='Create text file from asset file ids' class='btn btn-default'>Create text file from asset file id list</button>";
  sHTML+='</div>';
  document.getElementById("content").innerHTML=sHTML;
  if(nGAssetFileIndex<nGAssetFileIndexNeeded) createBillOfQuantity("","",1,sInCMN);
 }
 else
 {
  nGAssetFileIndex=0;
  nGAssetFileIndexNeeded=0;
  sHTML= '<div>';
  sHTML+= '<h2>Asset file generator</h2>';
  sHTML+= '<p>There will be unique asset id for each file.</p>';
  sHTML+= '<p>Please give a asset file creation quantity:</p>';
  sHTML+= '<div class="form-group">';
  sHTML+=  '<label for="idcmn">Customer Material Number (optional):</label>';
  sHTML+=  '<input type="text" class="form-control" id="idcmn" value="">';
  sHTML+= '</div>';
  sHTML+= '<div class="form-group">';
  sHTML+=  '<label for="idqty">Quantity:</label>';
  sHTML+=  '<input type="number" class="form-control" id="idqty" value="1" min="1" max="100">';
  sHTML+= '</div>';
  sHTML+= "<button onclick='createServers($(\"#idqty\").val(),$(\"#idcmn\").val())'>Create</button>";
  sHTML+='</div>';
  document.getElementById("content").innerHTML=sHTML;
 }

}

function doExportAssetIDlist()
{
 var today=new Date();
 var min=today.getMinutes();
 var hr=today.getHours();
 var dd=today.getDate();
 var mm=today.getMonth()+1;
 var yyyy=today.getFullYear();
 var dateTime=yyyy+"_"+mm+"_"+dd+"_"+hr+"_"+min;
 var location="Asset_ID_List_"+dateTime+".txt";
 var sList="";
 try
 {
  sList=document.getElementById("idcreatedidslist").innerHTML;
  sList=sList.replace(/\<option\>/gmi,'').replace(/\<\/option\>/gmi,'').replace(/\.xml/gmi,'\r\n');
  var blobObject=new Blob([sList]);
  window.navigator.msSaveBlob(blobObject,location);
 }
 catch(e)
 {
  document.getElementById("content").innerHTML="The browser do not support file saving?<br/>"+e.message;
 }
}

function createServerCall()
{
 if(nGAssetFileIndex<nGAssetFileIndexNeeded)
 {
  for(var j=0;j<oGActiveSolution.objects.length;j++)
  {
   if(typeof oGActiveSolution.objects[j].AT !== 'undefined') oGActiveSolution.objects[j].AT="";
  }
  createBillOfQuantity("","",1,sGCMN);
 }
}
//----------------------------------------------------------------------------------------------------------------
function export2csvp()
{
 var sCUEDD="",sCUCMN="",b_Ext=false,sTmpQty="",c_Cstics=[],tmpSIStrArray,n_pos=10,n_par=10;
 var stmpConfigurations="";var today=new Date();var min=today.getMinutes();var hr=today.getHours();var dd=today.getDate();var mm=today.getMonth()+1;var yyyy=today.getFullYear();
 var dateTime=yyyy+"_"+mm+"_"+dd+"_"+hr+"_"+min;var location="export_to_CSV_"+dateTime+".csv";var stmpDelta="";
 stmpConfigurations+="COMPANY CONFIDENTIAL;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\r\n";
 stmpConfigurations+="Offer Currency;EUR;Exchange Rate to EURO:;1;SWF Opportunity ID;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\r\n";
 stmpConfigurations+="Offer ID;Offer Description;Customer ID;Customer Name;Currency;Phase ID;Phase Description;CU ID;CU Description;CU Type;CU Status;Pricing date;Position;Parent Position;Product ID;Product Number(SSNR/Nokia code);NSN Item Class;Customer Material Number;Product Description;Contract Material Number;Item Category;Quantity;Unit;IRP / Unit;Currency;IRP Discount [%];IRP Markup [%];LSP/Unit;Currency;CP/Unit;Currency;ISP/Unit;Currency;CLP/Unit;Currency;CLP total;Currency;Price Erosion [%];CGP/Unit;Currency;CGP total;Currency;CGP Discount [%];CGP Markup;HW/SW/Service Discount [%];Volume Discount;CUP/Unit;Currency;CUP total;Currency;LSD Total;Currency;CNP/Unit;Currency;CNP total;Currency;CNP total;Currency;Cost Euro;GM(TOTAL);Currency;GIC;GIC Description;Technology;GUID;Service Package ID;Service Package Description;Service Sub-Package ID;Service sub-Package Description;Service Cost Total;Service Cost Per Unit[Euro];Service Cost Total[Euro];Cost Erosion[%];Cost Increase %;Price Model;Service Level;Avg.Tar.GM %;Offer T.GM %;M.B. Price;Share %;Capex Price;SW Price;IPC Price;IPC Cost;Validity Range;Reduction %;Term License;Item Classification\r\n";
 var nLineNbr=10;var nPLineNbr=10;var tmpArray;var tmpExt;var tmpExtNbr=0;var s_tmp_kbname="";
 for(var nSce=0;nSce<oGCAT.data.Scenarios.SCENARIO.length;nSce++)
 {
  if(oGCAT.data.Scenarios.SCENARIO[0].data.Phases.PHASE.length==0)
  {
   b_Ext=false;
   //Collect items under the same pci --------------------------------------
   var aPCIList=[],aSIDescr=[],aShort=[],aPCIDescr=[],aValidityRange=[],oTotal=[];
   for(var x in oGActiveSolution.objects)
   {
    if(oGActiveSolution.objects[x]["SI"])
    {
     if(oGActiveSolution.objects[x].extended===undefined)
     {
      if(oGActiveSolution.objects[x]["PCI"])
      {
	   if(oGActiveSolution.objects[x].name) aSIDescr[oGActiveSolution.objects[x]["SI"]]=(oGActiveSolution.objects[x]["SINAME"]||oGActiveSolution.objects[x].name);
	   if(oGActiveSolution.objects[x]["short"]) aShort[oGActiveSolution.objects[x]["SI"]]=oGActiveSolution.objects[x]["short"];
	   //Validity range in object
	   if(oGActiveSolution.objects[x]["validityrange"]) aValidityRange[oGActiveSolution.objects[x]["SI"]]=(oGActiveSolution.objects[x]["validityrange"]||"");
	   //Special requirements: "Validity Range" -> overrides object attribute
	   try
	   {
		for(var xzx in oGActiveSolution.objects[x].requirements)
		{
		 if((oGActiveSolution.objects[x].requirements[xzx].requirement).toUpperCase()=="VALIDITY RANGE")
		 {
		  var oRangeObject={};
		  var sTMPRange="";
		  try{oRangeObject=lGObjectsBySerId[oGActiveSolution.objects[x].requirements[xzx].connectedTo[0]]||{};}catch(errr){}
		  try{sTMPRange=oRangeObject.name||"";}catch(e){};
		  aValidityRange[oGActiveSolution.objects[x]["SI"]]=(sTMPRange||"");
		 }
		}
	   }catch(e){}
	   if(aPCIList[oGActiveSolution.objects[x]["PCI"]])
	   {
	    aPCIList[oGActiveSolution.objects[x]["PCI"]].push(oGActiveSolution.objects[x]["SI"]);
	    aPCIDescr[oGActiveSolution.objects[x]["PCI"]]=(oGActiveSolution.objects[x]["PCI_Description"]||"");
	   }
       else
	   {
	    aPCIList[oGActiveSolution.objects[x]["PCI"]]=[];
	    aPCIList[oGActiveSolution.objects[x]["PCI"]].push(oGActiveSolution.objects[x]["SI"]);
	    aPCIDescr[oGActiveSolution.objects[x]["PCI"]]=(oGActiveSolution.objects[x]["PCI_Description"]||"");
       }
	  }
     }
     else
     {
	  b_Ext=true;
	 }
	}
   }
   stmpConfigurations+=";Test offer from CAT;;;;"+(420000001)+";Phase - 1;;;"+(b_Ext ? "CU Equipment extension":"CU Equipment new")+";;"+dd+"."+mm+"."+yyyy+";"+n_pos+";;kbname;kbname;;;Test;;;1;PC;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;\r\n";
   n_pos+=10;
   var sSWRows="",s_rows="",n_order_rows=0,n_rows=0,sSysAssetID="",sTmpCMN="",nInstanceIndex=0,nInstQty=1;
   for(var x in aPCIList)
   {
    if(sSysAssetID!="")
    {
     stmpConfigurations+=";Test offer from CAT;;;;"+(420000001)+";Phase - 1;;;"+(b_Ext ? "CU Equipment extension":"CU Equipment new")+";;"+dd+"."+mm+"."+yyyy+";"+n_pos+";"+n_par+";"+x+";"+x+";;;"+(aPCIDescr[x]||(sSysAssetID+"_RC"+(nInstanceIndex + 1))).replace(/\;/,'')+";;;1;PC;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;"+(aValidityRange[y]||"")+";;;\r\n";
     s_rows+='<Row><Cell ss:Index="2"><Data ss:Type="Number">1</Data></Cell><Cell><Data ss:Type="Number">'+(n_pos)+'</Data></Cell><Cell ss:Index="5"><Data ss:Type="String">'+x+'</Data></Cell><Cell><Data ss:Type="String">'+(aPCIDescr[x]||(sSysAssetID+"_RC"+(nInstanceIndex + 1)))+'</Data></Cell><Cell><Data ss:Type="String">'+((nInstQty>1 ? (sTmpCMN ? sTmpCMN+"_"+(nInstanceIndex+1):sTmpCMN):sTmpCMN)||"CONFIGURATION")+'</Data></Cell><Cell ss:Index="8"><Data ss:Type="Number">1</Data></Cell></Row>';
    }
    else
    {
     stmpConfigurations+=";Test offer from CAT;;;;"+(420000001)+";Phase - 1;;;"+(b_Ext ? "CU Equipment extension":"CU Equipment new")+";;"+dd+"."+mm+"."+yyyy+";"+n_pos+";"+n_par+";"+x+";"+x+";;;"+(aPCIDescr[x]||x||"").replace(/\;/,'')+";;;1;PC;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;"+(aValidityRange[y]||"")+";;;\r\n";
     s_rows+='<Row><Cell ss:Index="2"><Data ss:Type="Number">1</Data></Cell><Cell><Data ss:Type="Number">'+(n_pos)+'</Data></Cell><Cell ss:Index="5"><Data ss:Type="String">'+x+'</Data></Cell><Cell><Data ss:Type="String">'+(aPCIDescr[x]||x||"")+'</Data></Cell><Cell><Data ss:Type="String">'+(sTmpCMN||"CONFIGURATION")+'</Data></Cell><Cell ss:Index="8"><Data ss:Type="Number">1</Data></Cell></Row>';
	}
    n_rows++;n_order_rows++;
    n_par=n_pos;
    n_pos+=10;
    var aQtyList=[];
    for(var y in aPCIList[x])
    {
     if(aQtyList[aPCIList[x][y]])
     {
      aQtyList[aPCIList[x][y]]++;
     }
     else
     {
      aQtyList[aPCIList[x][y]]=1;
     }
    }
    for(var y in aQtyList)
    {
     if(aSIDescr[y])
     {
	  stmpConfigurations+=";Test offer from CAT;;;;"+(420000001)+";Phase - 1;;;"+(b_Ext ? "CU Equipment extension":"CU Equipment new")+";;"+dd+"."+mm+"."+yyyy+";"+n_pos+";"+n_par+";"+y+";"+y+";;;"+aSIDescr[y].replace(/\,/,"").replace(" (Server)","").replace(" (Control)","").replace(" (Spine)","").replace(" (Z9100)","").replace(/\;/,'')+";;;"+(aQtyList[y])+";PC;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;"+(aValidityRange[y]||"")+";;;\r\n";
      s_rows+='<Row><Cell ss:Index="2"><Data ss:Type="Number">2</Data></Cell><Cell><Data ss:Type="Number">'+(n_pos)+'</Data></Cell><Cell><Data ss:Type="Number">'+(n_par)+'</Data></Cell><Cell><Data ss:Type="String">'+y+'</Data></Cell><Cell><Data ss:Type="String">'+aSIDescr[y].replace(/\,/,"").replace(" (Server)","").replace(" (Control)","").replace(" (Spine)","").replace(" (Z9100)","")+'</Data></Cell><Cell ss:Index="8"><Data ss:Type="Number">'+aQtyList[y]+'</Data></Cell>';
      if((aValidityRange[y]||"")!="")s_rows+='<Cell ss:Index="31"><Data ss:Type="Number">'+(aValidityRange[y]||"")+'</Data></Cell>';
      s_rows+='</Row>';
      if(!oTotal[y])oTotal[y]=[];oTotal[y].push({si:y,descr:aSIDescr[y].replace(/\,/,"").replace(" (Server)","").replace(" (Control)","").replace(" (Spine)","").replace(" (Z9100)",""),qty:aQtyList[y],sn:(aShort[y]||"")});
	 }
     else
     {
	  stmpConfigurations+=";Test offer from CAT;;;;"+(420000001)+";Phase - 1;;;"+(b_Ext ? "CU Equipment extension":"CU Equipment new")+";;"+dd+"."+mm+"."+yyyy+";"+n_pos+";"+n_par+";"+y+";"+y+";;;"+aSIDescr[y].replace(/\,/,"").replace(" (Server)","").replace(" (Control)","").replace(" (Spine)","").replace(" (Z9100)","").replace(/\;/,'')+";;;"+(aQtyList[y])+";PC;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;"+(aValidityRange[y]||"")+";;;\r\n";
      s_rows+='<Row><Cell ss:Index="2"><Data ss:Type="Number">2</Data></Cell><Cell><Data ss:Type="Number">'+(n_pos)+'</Data></Cell><Cell><Data ss:Type="Number">'+(n_par)+'</Data></Cell><Cell><Data ss:Type="String">'+y+'</Data></Cell><Cell><Data ss:Type="String">'+y+'</Data></Cell><Cell ss:Index="8"><Data ss:Type="Number">'+aQtyList[y]+'</Data></Cell>';
	  if((aValidityRange[y]||"")!="")s_rows+='<Cell ss:Index="31"><Data ss:Type="Number">'+(aValidityRange[y]||"")+'</Data></Cell>';
	  s_rows+='</Row>';
	  if(!oTotal[y])oTotal[y]=[];oTotal[y].push({si:y,descr:y,qty:aQtyList[y],sn:(aShort[y]||"")});
	 }
     n_pos+=10;
	 n_rows++;
	 n_order_rows++;
    }
   }
  }
  else
  {
   document.getElementById("content").innerHTML="CSV file content cannot be created.";
   return(0);
  }
 }
 document.getElementById("content").innerHTML="CSV file content created.";
 var blobObject=new Blob([stmpConfigurations]);window.navigator.msSaveBlob(blobObject,location);
}

function sGetAttributeHTML(oInKey,oInValue,nInLevel) {
   /*
   Primitive Data
   --------------
   The typeof operator can return one of these primitive types:
   - string
   - number
   - boolean
   - null (In JavaScript null is "nothing". It is supposed to be something that doesn't exist. !!! Unfortunately, in JavaScript, the data type of null is an object.!!!)
   - undefined

   Complex Data
   ------------
   The typeof operator can return one of two complex types:
   - function
   - object
   The typeof operator returns "object" for arrays because in JavaScript arrays are objects.

   Note!
   Difference Between Undefined and Null
   typeof undefined           // undefined
   typeof null                // object
   null === undefined         // false
   null == undefined          // true
   */
   var sTempCol="lightgreen";
   var sHTML="";
   var nLevel=nInLevel;
   var btmpLocation=false;
   var btmpDimension=false;
   if(oInKey.toUpperCase()=="NAME") sTempCol="lightblue";
   if(oInKey.toUpperCase()=="IMAGE") sTempCol="RGB(255,255,180)";
   if(oInKey.toUpperCase()=="LOCATION"){sTempCol="RGB(180,255,255)";};
   if(oInKey.toUpperCase()=="DIMENSION"){sTempCol="RGB(180,180,180)";};
   if(oInKey.toUpperCase()=="COMPONENT") sTempCol="blue";
   if(oInKey.toUpperCase()=="REQUIREMENT") sTempCol="RGB(255,180,180)";
   if(oInKey.toUpperCase()=="SERVICE") sTempCol="rgb(180,255,180)";
   if("[string][number][boolean]".indexOf("["+typeof oInValue+"]")>=0)
   {
   sHTML+="<div class=\"row\" style=\"margin-right: 6px;\">";
   //sHTML+= "<label class=\"col-sm-3 control-label\" style=\"text-transform:capitalize;\">"+oInKey+":</label>";
   sHTML+= "<label class=\"col-sm-3 control-label\">"+oInKey+":</label>";
   sHTML+=  "<div class=\"input-group col-sm-9\">";
   sHTML+=   "<input style=\"border-left: 6px solid "+sTempCol+";\" class=\"form-control\" type=\"text\" onblur=\"aGAttrList["+nInLevel+"]['"+oInKey+"']=this.value;doUpdateModelObjectList();\" value=\""+oInValue+"\"/>";
   sHTML+=  "</div>";
   sHTML+="</div>";
   }
   else if("[object]".indexOf("["+typeof oInValue+"]")>=0)
   {
   sHTML+="<div class=\"row\">";
   //sHTML+= "<label class=\"col-sm-3 control-label\" style=\"text-transform:capitalize;\">"+oInKey+":</label>";
   sHTML+= "<label class=\"col-sm-3 control-label\">"+oInKey+":</label>";
   sHTML+= "<div class=\"col-sm-9\">";
   sHTML+=  "<i onclick=\"(this.getAttribute('class')=='fa fa-toggle-on' ? this.setAttribute('class','fa fa-toggle-off'):this.setAttribute('class','fa fa-toggle-on'));\" class=\"fa fa-toggle-off\" data-toggle=\"collapse\" data-target=\"#coll"+oInKey+"I"+nGTmpIndex+"\" style=\"font-size:24px\"></i>";
   sHTML+=  "<div id=\"coll"+oInKey+"I"+(nGTmpIndex++)+"\" class=\"collapse\">";
   if(oInValue.length)
   {
      for(var ni=0;ni<oInValue.length;ni++)
      {
      if(oInValue[ni])
      {
      sHTML+="<div class=\"panel panel-info\">";
      if((oInKey||"").toUpperCase()=="SERVICES")
      {
         var sTemmpid=("DIV"+(new Date()).getTime().toString()+(nGSC++));
      sHTML+= "<div id=\""+sTemmpid+"\"></div><div class=\"panel-heading\">Data<span onclick=\"doShowOptions('"+sTemmpid+"','"+oInValue[ni]["service"]+"','','','"+oInValue[ni]["id"]+"',0,0,0,0,0)\" class=\"glyphicon glyphicon-cog\">+</span></div>";
      }
      else
      {
         sHTML+= "<div class=\"panel-heading\">Data</div>";
      }
      sHTML+= "<div class=\"panel-body\">";
      if("[object]".indexOf("["+typeof oInValue[ni]+"]")>=0)
      {
         aGAttrList.push(oInValue[ni]);
      nLevel=aGAttrList.length-1;
         for(var skey in oInValue[ni])
         {
         sHTML+=sGetAttributeHTML(skey,oInValue[ni][skey],nLevel);
         if(skey.toUpperCase()=="CONNECTEDTO")
         {
         for(var kii=0;kii<oInValue[ni][skey].length;kii++)
         {
         if((oInKey||"").toUpperCase()=="SERVICES")
         {

            }
            else
            {//Get object id for requirement id
            if(lGObjectsByReqId[oInValue[ni][skey][kii]])
            {
            $("#"+lGObjectsByReqId[oInValue[ni][skey][kii]].id).attr("style","border: 1px solid powderblue;");
         }
         }
         }
         }
         if(skey.toUpperCase()=="LOCATION") btmpLocation=true;
         if(skey.toUpperCase()=="DIMENSIONS") btmpDimension=true;
         }
      }
      else
      {
         sHTML+=   "<input style=\"border-left: 6px solid "+sTempCol+";\" class=\"form-control\" type=\"text\" onblur=\"aGAttrList["+nInLevel+"]['"+oInKey+"']["+ni+"]=this.value;\" value=\""+(oInValue[ni]||"").toString().replace(/\"/,"'")+"\"/>";
      }
      var sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
      sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
      sHTML+="<div class=\"row\">";
      sHTML+= "<div class=\"col-sm-3\">";
      sHTML+=  "<i title=\"Add new attribute\" class=\"fa fa-plus\" onClick=\"document.getElementById('"+sNewAttr+"').setAttribute('style','visibility: visible;border-left: 6px solid blue;')\" style=\"font-size:24px\"></i>";
      if(!btmpLocation) sHTML+=  "<span title=\"Add new location\" style=\"font-size:24px;color:lightblue\" onClick=\"aGAttrList["+nInLevel+"]['"+oInKey+"']["+ni+"].location={'x':0,'y':0,'z':0,'unit':'mm'};\" class=\"glyphicon glyphicon-map-marker\"></span>";
      if(!btmpDimension) sHTML+=  "<i title=\"Add dimensions\" style=\"font-size:24px;color:lightgreen\" class=\"fa fa-cube\" onClick=\"aGAttrList["+nInLevel+"]['"+oInKey+"']["+ni+"].dimensions={'width':0,'height':0,'depth':0,'unit':'mm'};\"></i>";
      sHTML+= "</div>";
      sHTML+= "<div class=\"col-sm-9\">";
      sHTML+=  "<input id=\""+sNewAttr+"\" style=\"visibility:hidden;border-left: 6px solid blue;\" class=\"form-control\" type=\"text\" onblur=\"aGAttrList["+nInLevel+"]['"+oInKey+"']["+ni+"][this.value]='value';\"/>";
      sHTML+= "</div>";
      sHTML+="</div>";


      sHTML+= "</div>";
      sHTML+="</div>";
      }
      }
   }
   else
   {
      sHTML+="<div class=\"panel panel-info\">";
      sHTML+= "<div class=\"panel-heading\">Data</div>";
      sHTML+= "<div class=\"panel-body\">";
      aGAttrList.push(oInValue);
      nLevel=aGAttrList.length-1;
      for(var skey in oInValue)
      {
      sHTML+=sGetAttributeHTML(skey,oInValue[skey],nLevel);
      }
      var sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
      sNewAttr=("C"+(new Date()).getTime().toString()+(nGSC++));
      sHTML+="<div class=\"row\">";
      sHTML+= "<div class=\"col-sm-3\">";
      sHTML+=  "<i title=\"Add new attribute\" class=\"fa fa-plus\" onClick=\"document.getElementById('"+sNewAttr+"').setAttribute('style','visibility: visible;border-left: 6px solid blue;')\" style=\"font-size:24px\"></i>";
      sHTML+= "</div>";
      sHTML+= "<div class=\"col-sm-9\">";

      sHTML+=  "<input id=\""+sNewAttr+"\" style=\"visibility:hidden;border-left: 6px solid blue;\" class=\"form-control\" type=\"text\" onblur=\"aGAttrList["+nInLevel+"]['"+oInKey+"']["+ni+"][this.value]='value';\"/>";
      sHTML+= "</div>";
      sHTML+="</div>";


      sHTML+= "</div>";
      sHTML+="</div>";
   }
   sHTML+=  "</div>";
   sHTML+= "</div>";
   sHTML+="</div>";
   }
   else
   {
   sHTML+="<div class=\"row\">";
   //sHTML+= "<label class=\"col-sm-3 control-label\" style=\"text-transform:capitalize;\">"+oInKey+":</label>";
   sHTML+= "<label class=\"col-sm-3 control-label\">"+oInKey+":</label>";
   sHTML+= "<div class=\"col-sm-9\">";
   sHTML+=   oInValue;
   sHTML+= "</div>";
   sHTML+="</div>";
   }
   return(sHTML);
}





function doGetModelObjectById(sInName)
{
 for(var x=0;x<oGActiveModel.objects.length;x++)
 {
  if(oGActiveModel.objects[x].name==sInName)
  {
   return(oGActiveModel.objects[x]);
  }
 }
 return({});
}

function doGetObjectById(sInId)
{
 for(var x=0;x<oGActiveSolution.objects.length;x++)
 {
  lGObjectsById[oGActiveSolution.objects[x].id]=oGActiveSolution.objects[x];
  if(oGActiveSolution.objects[x].requirements)
  {
   for(var y=0;y<oGActiveSolution.objects[x].requirements.length;y++)
   {
    if(oGActiveSolution.objects[x].requirements[y].id)
    {
	  try{if(!lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id])lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id]=oGActiveSolution.objects[x];}catch(e){lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id]=oGActiveSolution.objects[x];}
    }
   }
  }
  if(oGActiveSolution.objects[x].services)
  {
   for(var y=0;y<oGActiveSolution.objects[x].services.length;y++)
   {
    if(oGActiveSolution.objects[x].services[y].id)
    {
	  try{if(!lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id])lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id]=oGActiveSolution.objects[x];}catch(e){lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id]=oGActiveSolution.objects[x];}
    }
   }
  }
 }
 if(typeof lGObjectsById[sInId]==='undefined'){return(lGObjectsById[oGActiveSolution.objects[0].id]);}else{return(lGObjectsById[sInId]);}
}

function doGetObjectByReqId(sInId) {
   for(var x=0;x<(oGActiveSolution.objects||[]).length;x++) {
      lGObjectsById[oGActiveSolution.objects[x].id]=oGActiveSolution.objects[x];
      if(oGActiveSolution.objects[x].requirements) {
         for(var y=0;y<oGActiveSolution.objects[x].requirements.length;y++) {
            if(oGActiveSolution.objects[x].requirements[y].id) {
	            try {
                  if(!lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id]) lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id]=oGActiveSolution.objects[x];
               } catch(e) {
                  lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id]=oGActiveSolution.objects[x];
               }
 	         }
         }
      }
      if(oGActiveSolution.objects[x].services) {
	      for(var y=0;y<oGActiveSolution.objects[x].services.length;y++) {
            if(oGActiveSolution.objects[x].services[y].id) {
	            try {
                  if(!lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id]) lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id]=oGActiveSolution.objects[x];
               } catch(e) {
                  lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id]=oGActiveSolution.objects[x];
               }
            }
	      }
      }
   }
   return(lGObjectsByReqId[sInId]);
}

function doGetObjectBySerId(sInId) {
   for(var x=0;x<(oGActiveSolution.objects||[]).length;x++) {
      lGObjectsById[oGActiveSolution.objects[x].id]=oGActiveSolution.objects[x];
      if(oGActiveSolution.objects[x].requirements) {
         for(var y=0;y<oGActiveSolution.objects[x].requirements.length;y++) {
            if(oGActiveSolution.objects[x].requirements[y].id) {
               try {
                  if(!lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id])lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id]=oGActiveSolution.objects[x];
               } catch(e) {
                  lGObjectsByReqId[oGActiveSolution.objects[x].requirements[y].id]=oGActiveSolution.objects[x];
               }
            }
         }
      }
      if(oGActiveSolution.objects[x].services) {
         for(var y=0;y<oGActiveSolution.objects[x].services.length;y++) {
            if(oGActiveSolution.objects[x].services[y].id) {
               try {
                  if(!lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id])lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id]=oGActiveSolution.objects[x];
               } catch(e) {
                  lGObjectsBySerId[oGActiveSolution.objects[x].services[y].id]=oGActiveSolution.objects[x];
               }
            }
	      }
      }
   }
   return(lGObjectsBySerId[sInId]);
}
//---------------------------------------------------------------------------------------------------------------------------------------------
function bVisibleSide(aInPoints) {
   if(aInPoints.length>2) {
      var x1=aInPoints[0].x||0,y1=aInPoints[0].y||0,z1=aInPoints[0].z||0,x2=aInPoints[1].x||0,y2=aInPoints[1].y||0,z2=aInPoints[1].z||0,x3=aInPoints[2].x||0,y3=aInPoints[2].y||0,z3=aInPoints[0].z||0;
      var abi=0,abj=0,abk=0,aci=0,acj=0,ack=0,abci=0,abcj=0,abck=0,napu=0,xk=0,yk=0,zk=0,fapu=0.0;
      //a=(x1,y1,z1) b=(x2,y2,z2)
      //c=(x3,y3,z3)
      //Taso (etulevy kuvataan vektoreilla ab ja ac.
      //Lasketaan vektori ab:
      abi=x2-x1;
      abj=y2-y1;
      abk=z2-z1;
      //Lasketaan vektori ac:
      aci=x3-x1;
      acj=y3-y1;
      ack=z3-z1;
      //Lasketaan vektorin ab ja ac: skalaaritulo: abxac
      //       | i   j   k |
      // abxac=|abi abj abk|=(abj*ack-acj*abk)i+(abk*aci-ack*abi)j
      //       |aci acj ack| +(abi*acj-aci*abj)k
      abci=abi*ack-acj*abk;
      abcj=abk*ack-ack*abi;
      abck=abi*acj-aci*abj;
      //Lasketaan sitten vektorin abc kulma katselijan kulmaan
      //nähden. (katselija katsoo kappaleen origoon päin pisteestä:
      //kx=0; ky=0; kz=-1; katsojan sijainti origosta yksikkövektoreilla
      //ilmaistuna:
      xk=0;
      yk=0;
      zk=1; //Koska 0-(-1)=1
      //kahden vektorin välinen kulma:
      // cos(abc,xyz)=(abc*kxkykz)/(|abc||kxkykz|)
      // |abc|=sqrt(abci**2+abcj**2+abck**2)
      // |kxkykz|=sqrt(xk*2+ky**2+kz**2)
      // abc*kxkykz=abci*xk+abcj*yk+abck*zk
      fapu=(abci*xk+abcj*yk+abck*zk)/parseFloat(Math.sqrt(abci*abci+abcj*abcj+abck*abck)*Math.sqrt(xk*xk+yk*yk+zk*zk));
      napu=parseInt(Math.acos(fapu)*180/3.1415);
      if(((napu<90)&&(napu>=0))||((napu<360)&&(napu>=270))) {
         return(true);
      } else {
         return(false);
      }
   }
   return(false);
}


function initialize()
{
 $("#TEversionId").html(sGpwaTEversion);
 $("#content").html("");
 if(typeof Storage !=="undefined")
 {
  try
  {
   if(localStorage.teprojects)
   {
	oGActiveModel=JSON.parse(localStorage.teamodel);
   }
  }
  catch(e){}
 }
 $("#validbutton,#notvalidbutton,#solutionsalesitemgroup,.dropdown,#configurecommand,#createbillofquantitycommand").hide();
 $("#import").show();
 $("#changeenginecommand").show();
}

function doSave2LS()
{
 if(typeof Storage !=="undefined")
 {
  try
  {
   delete localStorage.teprojects;
   localStorage.teamodel=JSON.stringify(oGActiveModel);
  }catch(e){}
 }
 for (var x in oWebWorkers)
 {
  doStopWorker(oWebWorkers[x]);
 }
}



function doCleanUp(){window.clearInterval(idForCleaning);CollectGarbage();}


function doActivateConf()
{
 doConfigure(sGSelectedConfigurationID);
}


function doStopWorker(oInWorker)
{
 try
 {
  if(typeof(Worker) !== "undefined")
  {
   if(oInWorker !== 'undefined')
   {
	 oInWorker.terminate();
	 delete oInWorker;
   }
  }
 }catch(e){}
}

function doWWSelect(sInId, sInSelectionIndex)
{
 try
 {
  if(typeof(Worker) !== "undefined")
  {
   if(sGSelectedConfigurationID != "")
   {
	if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	{
	 oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify({selections:[{id: sInId,value: sInSelectionIndex}]}));
	}
   }
  }
 }
 catch(e)
 {
  document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
 }
}


function doChangeReqValue(sInId, sInValue) {
   var xConf = getConfigByID(sGSelectedConfigurationID);
   if(xConf != null) {
      try {
         if(typeof(Worker) !== "undefined") {
	         if(sGSelectedConfigurationID != "") {
	            if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined') {
	               xConf.data.setvalues = [];
	               xConf.data.setvalues.push({id: sInId,	value: sInValue});//doPostMessage({setvalues:[{id: sInId, value: sInValue}]});
	               var webWorkerData = { xConf: xConf, validator: _VALIDATOR	};
	               oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
            	 }
	         }
         }
      }
      catch(e) {
         document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
      }
   }
}

function addObject2SolutionByIndex(nInIndex, nInQty, sInService, sInObjectName, sInSelection,sInSelectionName,sInRequirementOwnerId)
//function addObject2SolutionByIndex(nInIndex, nInQty, sInService, sInObjectName, sInSelection)
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.addobjects = [];
	  //xConf.data.addobjects.push({index: nInIndex,qty: nInQty,service: sInService,object: sInObjectName,selection: sInSelection	});
	  xConf.data.addobjects.push({index: nInIndex,qty: nInQty,service: sInService,object: sInObjectName,selection: sInSelection	,selectionname:(sInSelectionName||''),reqownerid:(sInRequirementOwnerId||'')});
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function selectTab(sInAction, sInParameters, sInSelectedTabId, sInConfigurationId)
{
 //	This function is used to select tab (group of charachters) during the configuration session.
 //	IN: sInAction: contains the url and session information
 //	IN: sInParameters: contains the configuration session parameters that has to be passed during the call
 //	IN: sInSelectedTabId: contains the selected tab (group) id
 //	IN: sInConfigurationId: contains the configuration id
 //	Updated by ALe 13:04 18.8.2016
 //
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if (xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if (sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data["-ZTABIDX"] = sInSelectedTabId;//doPostMessage({"-ZTABIDX"]:sInSelectedTabId});
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
//	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}




function doShowOptions(sInElementId,sInService,sInRequirement,sInCurrentSelection,sInServiceID,f2DInX,f2DInY,fInX,fInY,fInZ)
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.showoptions = [];
	  xConf.data.showoptions.push({elementid:sInElementId,service:sInService,requirement:sInRequirement,selection:sInCurrentSelection,serviceid:sInServiceID,f2dx:f2DInX,f2dy:f2DInY,fx:fInX,fy:fInY,fz:fInZ});
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
//	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function doConnectRID2SID(sInRequirementID,sInServiceID)
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.connrid2sid = [];
	  xConf.data.connrid2sid.push({rid:sInRequirementID,sid:sInServiceID});
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
//	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function doAddObjectToService(sInRadioName,sInServiceID,sInServiceName,sInObjectName)
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.addo2services = [];
	  xConf.data.addo2services.push({radioname:sInRadioName,serviceid:sInServiceID,servicename:sInServiceName,objectname:sInObjectName});
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
//	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function createBillOfQuantity(sInForMail,cfgInner, cfgQuantity,sInCMN,nInServerNbr)
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.getbillofqtys = [];
	  if(nGAssetFileIndex>0)
	  {
	   xConf.data.getbillofqtys.push({formail:sInForMail,cfginner:cfgInner,cfgqty:cfgQuantity,scmn:sInCMN,servernbr:nInServerNbr||1,reconfigure:true});
	  }
	  else
	  {
	   xConf.data.getbillofqtys.push({formail:sInForMail,cfginner:cfgInner,cfgqty:cfgQuantity,scmn:sInCMN,servernbr:nInServerNbr||1,reconfigure:false});
	  }
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function doGoBack()
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.back = true;
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
//	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function doReConfigure()
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.reconfigure = true;
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function doSetUpConfiguration(lInSelections,sPossibleAssetId)
{
 var xConf = getConfigByID(sGSelectedConfigurationID);

 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
     document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	  xConf.data.reconfigure = true;
	  xConf.data.lSelections=JSON.parse(JSON.stringify(lInSelections));
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR,importedAssetId:(sPossibleAssetId||"")};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function doShowContent(sInElementId,sInService,sInFUName,sInObjectID,fInX,fInY)
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.showcontents = [];
	  xConf.data.showcontents.push({elementid:sInElementId, service:sInService, funame: sInFUName, objectid:sInObjectID, x:fInX,y:fInY});
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
//	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function doExtend()
{
 var xConf = getConfigByID(sGSelectedConfigurationID);
 if(xConf != null)
 {
  try
  {
   if(typeof(Worker) !== "undefined")
   {
	if(sGSelectedConfigurationID != "")
	{
	 if(typeof(oWebWorkers[sGSelectedConfigurationID]) !== 'undefined')
	 {
	  xConf.data.extend = true;
	  var webWorkerData = {xConf: xConf,validator: _VALIDATOR};
	  oWebWorkers[sGSelectedConfigurationID].postMessage(JSON.stringify(webWorkerData));
//	  document.getElementById("content").innerHTML ='<i class="fa fa-spinner fa-spin" style="font-size:48px"></i>';
	 }
	}
   }
  }
  catch(e)
  {
   document.getElementById("cacheinfo").innerHTML = "<span style='color: red;'>Unsupported configuration?</span>";
  }
 }
}

function addObject2SolutionByName(sInObjectName,nInQty,vInWhat) {
   if(bGUseNewEngine) {
      if(typeof oWebWorkers[sGSelectedConfigurationID] === 'undefined') {
      }
      oWebWorkers[sGSelectedConfigurationID].postMessage({"cmd":"addObject","name":sInObjectName});
   } else {
      for(var x=0;x<oGActiveModel.objects.length;x++) {
         if(oGActiveModel.objects[x].name==sInObjectName) {
            addObject2SolutionByIndex(x,nInQty,'','','');
            break;
         }
      }
   }
}
