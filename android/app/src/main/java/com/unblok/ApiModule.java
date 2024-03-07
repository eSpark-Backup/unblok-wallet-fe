package com.unblok;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.provider.Settings;
import android.util.Log;
import android.view.inputmethod.InputMethodInfo;
import android.view.inputmethod.InputMethodManager;

import java.util.List;

public class ApiModule extends ReactContextBaseJavaModule {


    public ApiModule(ReactApplicationContext reactContext) {
        super(reactContext);

    }

    @Override
    public String getName() {
        return "ApiModule";
    }
    String appName = getCurrentAppName();

    @ReactMethod
    public void receiveMail(String mailAddress) {
        Log.d("Mail Address Received: ", "" + mailAddress);

        // Store mailAddress in SharedPreferences
        SharedPreferences sharedPreferences = getReactApplicationContext().getSharedPreferences("your_shared_prefs_name", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("MAILADDRESS", mailAddress);
        editor.apply();
        Log.d("Mail Address Stored: ", "" + mailAddress);
        Log.d("App name:",""+appName);
    }
    private String getCurrentAppName() {
        Context context = getReactApplicationContext();
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm != null) {
            List<InputMethodInfo> inputMethods = imm.getEnabledInputMethodList();
            for (InputMethodInfo inputMethodInfo : inputMethods) {
                if (inputMethodInfo.getServiceName().equals(ApiModule.class.getName())) {
                    ComponentName componentName = ComponentName.unflattenFromString(inputMethodInfo.getSettingsActivity());
                    PackageManager packageManager = context.getPackageManager();
                    try {
                        return packageManager.getApplicationLabel(packageManager.getApplicationInfo(componentName.getPackageName(), PackageManager.GET_META_DATA)).toString();
                    } catch (PackageManager.NameNotFoundException e) {
                        e.printStackTrace();
                    }
                    break;
                }
            }
        }
        return "";
    }
    @ReactMethod
    public void loginStatus(String status) {
    }

    @ReactMethod
    public void sendKeyword(Boolean Keyword) {
        Log.d("Keyword Received: ", "" + Keyword);
        // Store mailAddress in SharedPreferences
        SharedPreferences sharedPreferences = getReactApplicationContext().getSharedPreferences("your_shared_prefs_name", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putBoolean("KEYWORD", Keyword);
        editor.apply();
        Log.d("Keyword Stored: ", "" + Keyword);
    }

    @ReactMethod
    public void openKeyboardSettings() {
        Intent intent = new Intent(Settings.ACTION_INPUT_METHOD_SETTINGS);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getCurrentActivity().startActivity(intent);
    }

    @ReactMethod
    public void openWallet(Callback callback) {
        Intent receivedIntent = getCurrentActivity().getIntent();
        String videoTitle = receivedIntent.getStringExtra("OpenWallet");
        Log.d("IntentResult:", "" + videoTitle);
        if (videoTitle == "OpenWallet") {
            callback.invoke(true);
            return;
        }
        callback.invoke(false);
    }
    @ReactMethod
    public void openDapp(Callback callback) {
        Intent receivedIntent = getCurrentActivity().getIntent();
        String videoTitle = receivedIntent.getStringExtra("OpenDapp");
        Log.d("IntentResult:", "" + videoTitle);
        if (videoTitle == "OpenDapp") {
            callback.invoke(true);
            return;
        }
        callback.invoke(false);
    }

    @ReactMethod
    public boolean OpenWallet2() {
        Intent receivedIntent = getCurrentActivity().getIntent();
        String videoTitle = receivedIntent.getStringExtra("OpenWallet");
        Log.d("IntentResult:", "" + videoTitle);
        if (videoTitle == "OpenWallet") {
            return true;
        }
        else{
            return false;
        }

    }

    @ReactMethod
    public void isKeyboardEnabled(Callback callback) {
        InputMethodManager inputMethodManager = (InputMethodManager) getCurrentActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
        List<InputMethodInfo> enabledKeyboards = inputMethodManager.getEnabledInputMethodList();
        Log.d("Enabled Keyboards:", "" + enabledKeyboards);
        String desiredKeyboardPackageName = "com.unblok/org.dslul.openboard.inputmethod.latin.LatinIME"; // Replace with the actual package name

        for (InputMethodInfo keyboard : enabledKeyboards) {
            Log.d("Package name:", "" + keyboard.getComponent().flattenToString());
            if (keyboard.getComponent().flattenToString().equals(desiredKeyboardPackageName)) {
                callback.invoke(true);
                return;
            }
        }
        callback.invoke(false);
    }
    @ReactMethod
    public void openInputMethodPickerAndNavigate() {
        InputMethodManager imeManager = (InputMethodManager) getReactApplicationContext().getSystemService(Context.INPUT_METHOD_SERVICE);
        imeManager.showInputMethodPicker();
    }

}
