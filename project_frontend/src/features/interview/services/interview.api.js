import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function GetInterviewReport({ jobdescription, resume, selfdescription }) {
  const formData = new FormData();

  formData.append("jobdescription", jobdescription);
  formData.append("resume", resume);
  formData.append("selfdescription", selfdescription);

  const response = await api.post("/api/interview/Interviewai", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function GetInterviewReportandDisplay(interviewid) {
  const response = await api.get(`/api/interview/report/${interviewid}`);
  return response.data;
}

export async function GetAllReportOfUser() {
  const response = await api.get("/api/interview/");
  return response.data;
}