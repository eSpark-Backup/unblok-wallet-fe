package com.unblok;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.unblock.R;

// import org.devio.rn.splashscreen.SplashScreen;
public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "safewallet";
    }

     /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            // If you opted-in for the New Architecture, we enable the Fabric Renderer.
            DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Add the following lines before setContentView
        setTheme(R.style.SplashTheme);
        handleCustomURI(getIntent());
        startBackgroundService();

        // Set the Android background to white after 8 seconds
        // to fix the splashscreen flash when the keyboard is shown
        new CountDownTimer(8000, 1000) {

            public void onTick(long millisUntilFinished) {
            }

            public void onFinish() {
                getWindow().getDecorView().setBackgroundColor(Color.WHITE);
            }

        }.start();
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleCustomURI(intent);
    }

    private void handleCustomURI(Intent intent) {
        Uri uri = intent.getData();
        if (uri != null) {
            // Extract data from the URI and navigate to the appropriate screen
            String path = uri.getPath();
            // Handle the path and perform navigation as needed
        }
    }

    private void startBackgroundService() {
        Intent serviceIntent = new Intent(this, MyBackgroundService.class);
        startService(serviceIntent);
    }


}
