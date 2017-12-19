#target InDesign-13.064
main();

function main(){
    
    //This is the edge name database    
    //database need minimum 2 field : SN and Name
    var YourCSV = "C:\\Users\\chowst\\Desktop\\newname.csv";
    //must be an existing folder, please remember the last "\\"
    var YourOutputDir = "C:\\ExtScript\\output\\";
    var YourOutputPDF = "AutoPlanner";
    var YourPage = 80;
    
    var myFolder = "C:/ExtScript";
    var myIndd = myFolder + "/indd";
    var myDB = myFolder + "/csv";
    var myLog = myFolder + "/log";
    var myOutput = myFolder + "/output";
    var myXML = myFolder + "/xml";
    
    var inddSide = myIndd + "/side/side.indd";
    var inddEdge = myIndd + "/edgeSide/edgeSide.indd";
    var inddPlan = myIndd + "/planner/planner.indd";
    
    var outSide = myIndd + "/edgeSide/DesignerLinks/";
    var outEdge = myIndd + "/planner/DesignerLinks/Assets/";
    var outPlan = myOutput;

    var tmplSide = myXML + "/Template_side.xml";
    var tmplEdge = myXML + "/Template_edgeSide.xml";
    var tmplPlan = myXML + "/Template_planner.xml";
    
    var DBFile = File(YourCSV);
    DBFile.open('r', "TEXT");
    var sLine = DBFile.readln();
    var sHeader = sLine;
    var i = 1; 
    
    //counter database
    var sCNTFile = myDB + "/cnt.csv";
    var CNTFile = new File(sCNTFile);
    CNTFile.open('w', "TEXT");
    CNTFile.writeln("Counter");
    for (var x=1;x<=YourPage;x++){
        CNTFile.writeln(x);
    }
    CNTFile.close();
    
    //planner database
    var sPlanFile = myDB + "/planner.csv";
    var PlanFile = new File(sPlanFile);
    PlanFile.open('w', "TEXT");
    var sPlanHeader = sHeader + ",PageOdd,PageEven,Counter,PDF"
    PlanFile.writeln(sPlanHeader);
        
    while (!DBFile.eof){
        sLine = DBFile.readln();
        var sDBFile = myDB + "/DBName1.csv";
        var newCSV = new File(sDBFile);
        newCSV.open('w', "TEXT");
        newCSV.writeln(sHeader);
        newCSV.writeln(sLine);
        newCSV.close();

        //prepare side.xml
        var sXML;
        var xmlSide = myXML + "/side.xml";
        var XMLFile = File(tmplSide);
        XMLFile.open('r', "TEXT");
        sXML = XMLFile.read();
        XMLFile.close();
        
        sXML = sXML.replace("{INDD}", inddSide);
        sXML = sXML.replace("{DBFile}", sDBFile);
        sXML = sXML.replace("{OUTPUT}", outSide);
        sXML = sXML.replace("{LOG}", myLog);
        
        var newXML = new File(xmlSide);
        newXML.open('w', "TEXT");
        newXML.write(sXML);
        newXML.close();
        
        app.createJob(xmlSide);
        
        //prepare edgeSide.xml
        var xmlEdge = myXML + "/edgeSide.xml";
        var XMLFile2 = File(tmplEdge);
        XMLFile2.open('r', "TEXT");
        sXML = XMLFile2.read();
        XMLFile2.close();
        
        sXML = sXML.replace("{INDD}", inddEdge);
        sXML = sXML.replace("{DBFile}", sCNTFile);
        sXML = sXML.replace("{OUTPUT}", outEdge);
        var sOutput = "edgeSide_R" + i;
        sXML = sXML.replace("{PDF}", sOutput);
        sXML = sXML.replace("{LOG}", myLog);
        
        var newXML2 = new File(xmlEdge);
        newXML2.open('w', "TEXT");
        newXML2.write(sXML);
        newXML2.close();
        
        app.createJob(xmlEdge);
        
        //write to planner.csv
        var sPlanLn = "";
        var planOdd = 1;
        var planEven = 2;
        var planCnt = 1;
        for (var x=1;x<=YourPage;x++){
            sPlanLn = sLine + "," + planOdd + "," + planEven + "," + planCnt + "," + sOutput + ".pdf";
            PlanFile.writeln(sPlanLn);
            planOdd+=2;
            planEven+=2;
            planCnt++;
        }
        
        i++;
    }

    PlanFile.close();
    DBFile.close();
    
    //prepare edgeSide.xml
    var xmlPlan = myXML + "/planner.xml";
    var XMLFile3 = File(tmplPlan);
    XMLFile3.open('r', "TEXT");
    sXML = XMLFile3.read();
    XMLFile3.close();
        
    sXML = sXML.replace("{INDD}", inddPlan);
    sXML = sXML.replace("{DBFile}", sPlanFile);
    sXML = sXML.replace("{OUTPUT}", YourOutputDir);
    sXML = sXML.replace("{PDF}", YourOutputPDF);
    sXML = sXML.replace("{LOG}", myLog);
        
    var newXML3 = new File(xmlPlan);
    newXML3.open('w', "TEXT");
    newXML3.write(sXML);
    newXML3.close();
        
    app.createJob(xmlPlan);
    
    alert("Done.", "Personalised Edge");

 }
