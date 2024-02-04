import axiosInstance from "./axiosInstance";

const fileGetApi = async () => {
  try {
    const spaceId = localStorage.getItem("spaceId");

    if (!spaceId) {
      console.error("spaceId ID not found in sessionStorage.");
      return;
    }

    const response = await axiosInstance.get(
      `/files/${spaceId}`,
      {
        spaceId: spaceId,
      }
    );
    return response.data.response;
  } catch (error) {
    console.error("getChatMessages 에러:", error);
  }
};

export default fileGetApi;