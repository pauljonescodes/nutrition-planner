```
    <key>com.apple.security.files.bookmarks.app-scope</key>
    <true/>
    <key>com.apple.security.print</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
    <key>com.apple.security.device.microphone</key>
    <true/>
    <key>com.apple.security.device.usb</key>
    <true/>
```

codesign -vvv --deep --strict

    <key>com.apple.security.application-groups</key>
    <array>
      <string>24TXZ384X3.com.adeptry.nutritionplanner</string>
    </array>

Asset validation failed (90287)
Invalid Code Signing Entitlements. The entitlements in your app bundle signature do not match the ones that are contained in the provisioning profile. The bundle contains a key that is not included in the provisioning profile: 'com.apple.developer.team-identifier' in 'com.adeptry.nutritionplanner.pkg/Payload/Nutrition Planner.app/Contents/MacOS/Nutrition Planner'. (ID: 399ebb97-beae-4c7d-add4-8f09756895ba)

Asset validation failed (90287)
Invalid Code Signing Entitlements. The entitlements in your app bundle signature do not match the ones that are contained in the provisioning profile. The bundle contains a key that is not included in the provisioning profile: 'com.apple.application-identifier' in 'com.adeptry.nutritionplanner.pkg/Payload/Nutrition Planner.app/Contents/MacOS/Nutrition Planner'. (ID: 6d161466-7cc4-40a0-94d4-0eb852482514)

codesign --d --entitlements
