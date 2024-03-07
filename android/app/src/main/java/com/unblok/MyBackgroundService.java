package com.unblok;

import android.app.Service;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

public class MyBackgroundService extends Service {

    private static final String TAG = "MyBackgroundService";

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Fetch and store the application label
        String appLabel = getApplicationLabel();
        Toast.makeText(this, "Service started by user.", Toast.LENGTH_LONG).show();
        // Print the application label in the log
        Log.d(TAG, "Application Label: " + appLabel);

        // Perform other background tasks here

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        Toast.makeText(this, "Service destroyed by user.", Toast.LENGTH_LONG).show();
        super.onDestroy();
    }

    private String getApplicationLabel() {
        PackageManager packageManager = getPackageManager();
        ApplicationInfo applicationInfo;
        try {
            applicationInfo = packageManager.getApplicationInfo(getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
            return "";
        }
        return (String) packageManager.getApplicationLabel(applicationInfo);
    }
}

