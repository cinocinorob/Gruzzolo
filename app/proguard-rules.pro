# The web page calls these methods by name through WebView.addJavascriptInterface,
# so R8 must keep them and their annotation.
-keepattributes RuntimeVisibleAnnotations
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
