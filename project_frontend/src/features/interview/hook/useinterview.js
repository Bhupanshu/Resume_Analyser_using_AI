import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import {
  GetInterviewReport,
  GetInterviewReportandDisplay,
  GetAllReportOfUser,
  DeleteInterviewReport
} from "../services/interview.api";

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setLoading, report, setReport, reports, setReports } = context;

    async function generateReport({jobdescription,resume,selfdescription}){
        setLoading(true) 

        try{
            const response = await GetInterviewReport({jobdescription,resume,selfdescription})
            setReport(response.interviewReport)
            return response.interviewReport
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
        
    }

    async function getReportbyID(Interviewid){
        setLoading(true)
        try{
            const  response = await GetInterviewReportandDisplay(Interviewid)
            setReport(response.interviewReport)
            return response.interviewReport
        }
        catch (err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
       
    }

    async function getReports(){
        setLoading(true)
    

        try {
        const response = await GetAllReportOfUser();
            setReports(response.interviewReports)
            return response.interviewReports
        }
        catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
        
    }

    async function deleteReport(interviewid) {
  try {
    await DeleteInterviewReport(interviewid);
    setReports((prev) => (prev || []).filter((r) => r._id !== interviewid));
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

return { loading, report, reports, generateReport, getReportbyID, getReports, deleteReport }
}