package com.unblok.DataModal;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

public class Data {

    @SerializedName("userDetails")
    @Expose
    private UserDetails userDetails;
    @SerializedName("_id")
    @Expose
    private String id;
    @SerializedName("deviceId")
    @Expose
    private String deviceId;
    @SerializedName("passcode_status")
    @Expose
    private Integer passcodeStatus;
    @SerializedName("notification_status")
    @Expose
    private Integer notificationStatus;
    @SerializedName("status")
    @Expose
    private Integer status;
    @SerializedName("online_status")
    @Expose
    private Boolean onlineStatus;
    @SerializedName("face_status")
    @Expose
    private Boolean faceStatus;
    @SerializedName("finger_status")
    @Expose
    private Boolean fingerStatus;
    @SerializedName("created_date")
    @Expose
    private String createdDate;
    @SerializedName("__v")
    @Expose
    private Integer v;

    public UserDetails getUserDetails() {
        return userDetails;
    }

    public void setUserDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public Integer getPasscodeStatus() {
        return passcodeStatus;
    }

    public void setPasscodeStatus(Integer passcodeStatus) {
        this.passcodeStatus = passcodeStatus;
    }

    public Integer getNotificationStatus() {
        return notificationStatus;
    }

    public void setNotificationStatus(Integer notificationStatus) {
        this.notificationStatus = notificationStatus;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Boolean getOnlineStatus() {
        return onlineStatus;
    }

    public void setOnlineStatus(Boolean onlineStatus) {
        this.onlineStatus = onlineStatus;
    }

    public Boolean getFaceStatus() {
        return faceStatus;
    }

    public void setFaceStatus(Boolean faceStatus) {
        this.faceStatus = faceStatus;
    }

    public Boolean getFingerStatus() {
        return fingerStatus;
    }

    public void setFingerStatus(Boolean fingerStatus) {
        this.fingerStatus = fingerStatus;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getV() {
        return v;
    }

    public void setV(Integer v) {
        this.v = v;
    }

}