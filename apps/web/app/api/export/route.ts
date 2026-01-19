import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import type { ComponentNode, AppDefinition, Screen } from '@swiftship/core';
import { generateApp } from '@swiftship/codegen';

export async function POST(request: NextRequest) {
  try {
    const { projectName, componentTree } = await request.json();

    if (!componentTree) {
      return NextResponse.json({ error: 'Component tree is required' }, { status: 400 });
    }

    const safeName = projectName.replace(/[^a-zA-Z0-9]/g, '') || 'MyApp';
    const bundleId = `com.swiftship.${safeName.toLowerCase()}`;

    // Create app definition
    const appDefinition: AppDefinition = {
      config: {
        name: safeName,
        bundleId,
        displayName: projectName,
        version: '1.0.0',
        buildNumber: '1',
        minIOSVersion: '17.0',
        supportedDevices: ['iphone'],
        accentColor: '#007AFF',
        supportsLightMode: true,
        supportsDarkMode: true,
        usesSwiftData: false,
        usesCloudKit: false,
      },
      screens: [
        {
          id: 'main',
          name: 'Main',
          content: componentTree as ComponentNode,
        } as Screen,
      ],
      entryScreen: 'main',
    };

    // Generate app files
    const generated = generateApp(appDefinition);

    // Create ZIP file
    const zip = new JSZip();

    // Add generated Swift files
    for (const file of generated.files) {
      zip.file(`${safeName}/${file.path}`, file.content);
    }

    // Add Xcode project files
    const xcodeProjectFiles = generateXcodeProject(safeName, bundleId);
    for (const [path, content] of Object.entries(xcodeProjectFiles)) {
      zip.file(`${safeName}/${path}`, content);
    }

    // Add Assets.xcassets
    zip.file(`${safeName}/Assets.xcassets/Contents.json`, JSON.stringify({
      info: { author: 'xcode', version: 1 },
    }, null, 2));

    zip.file(`${safeName}/Assets.xcassets/AccentColor.colorset/Contents.json`, JSON.stringify({
      colors: [{ idiom: 'universal', color: { 'color-space': 'srgb', components: { red: '0.000', green: '0.478', blue: '1.000', alpha: '1.000' } } }],
      info: { author: 'xcode', version: 1 },
    }, null, 2));

    zip.file(`${safeName}/Assets.xcassets/AppIcon.appiconset/Contents.json`, JSON.stringify({
      images: [{ idiom: 'universal', platform: 'ios', size: '1024x1024' }],
      info: { author: 'xcode', version: 1 },
    }, null, 2));

    // Generate the ZIP
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeName}.zip"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateXcodeProject(appName: string, bundleId: string): Record<string, string> {
  const projectUUID = generateXcodeUUID();
  const mainGroupUUID = generateXcodeUUID();
  const sourcesGroupUUID = generateXcodeUUID();
  const viewsGroupUUID = generateXcodeUUID();
  const assetsGroupUUID = generateXcodeUUID();
  const buildConfigDebugUUID = generateXcodeUUID();
  const buildConfigReleaseUUID = generateXcodeUUID();
  const configListUUID = generateXcodeUUID();
  const targetUUID = generateXcodeUUID();
  const targetBuildConfigDebugUUID = generateXcodeUUID();
  const targetBuildConfigReleaseUUID = generateXcodeUUID();
  const targetConfigListUUID = generateXcodeUUID();
  const sourcesBuildPhaseUUID = generateXcodeUUID();
  const resourcesBuildPhaseUUID = generateXcodeUUID();
  const appFileRefUUID = generateXcodeUUID();
  const contentViewFileRefUUID = generateXcodeUUID();
  const mainViewFileRefUUID = generateXcodeUUID();
  const assetsFileRefUUID = generateXcodeUUID();
  const productRefGroupUUID = generateXcodeUUID();

  // project.pbxproj
  const pbxproj = `// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {

/* Begin PBXBuildFile section */
		${appFileRefUUID}1 /* ${appName}App.swift in Sources */ = {isa = PBXBuildFile; fileRef = ${appFileRefUUID}; };
		${contentViewFileRefUUID}1 /* ContentView.swift in Sources */ = {isa = PBXBuildFile; fileRef = ${contentViewFileRefUUID}; };
		${mainViewFileRefUUID}1 /* MainView.swift in Sources */ = {isa = PBXBuildFile; fileRef = ${mainViewFileRefUUID}; };
		${assetsFileRefUUID}1 /* Assets.xcassets in Resources */ = {isa = PBXBuildFile; fileRef = ${assetsFileRefUUID}; };
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
		${targetUUID} /* ${appName}.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = "${appName}.app"; sourceTree = BUILT_PRODUCTS_DIR; };
		${appFileRefUUID} /* ${appName}App.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "${appName}App.swift"; sourceTree = "<group>"; };
		${contentViewFileRefUUID} /* ContentView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "ContentView.swift"; sourceTree = "<group>"; };
		${mainViewFileRefUUID} /* MainView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "MainView.swift"; sourceTree = "<group>"; };
		${assetsFileRefUUID} /* Assets.xcassets */ = {isa = PBXFileReference; lastKnownFileType = folder.assetcatalog; path = Assets.xcassets; sourceTree = "<group>"; };
/* End PBXFileReference section */

/* Begin PBXGroup section */
		${mainGroupUUID} = {
			isa = PBXGroup;
			children = (
				${sourcesGroupUUID} /* Sources */,
				${assetsFileRefUUID} /* Assets.xcassets */,
				${productRefGroupUUID} /* Products */,
			);
			sourceTree = "<group>";
		};
		${productRefGroupUUID} /* Products */ = {
			isa = PBXGroup;
			children = (
				${targetUUID} /* ${appName}.app */,
			);
			name = Products;
			sourceTree = "<group>";
		};
		${sourcesGroupUUID} /* Sources */ = {
			isa = PBXGroup;
			children = (
				${appFileRefUUID} /* ${appName}App.swift */,
				${contentViewFileRefUUID} /* ContentView.swift */,
				${viewsGroupUUID} /* Views */,
			);
			path = Sources;
			sourceTree = "<group>";
		};
		${viewsGroupUUID} /* Views */ = {
			isa = PBXGroup;
			children = (
				${mainViewFileRefUUID} /* MainView.swift */,
			);
			path = Views;
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		${targetUUID}T /* ${appName} */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = ${targetConfigListUUID};
			buildPhases = (
				${sourcesBuildPhaseUUID} /* Sources */,
				${resourcesBuildPhaseUUID} /* Resources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = "${appName}";
			productName = "${appName}";
			productReference = ${targetUUID};
			productType = "com.apple.product-type.application";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		${projectUUID} /* Project object */ = {
			isa = PBXProject;
			buildConfigurationList = ${configListUUID};
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = ${mainGroupUUID};
			productRefGroup = ${productRefGroupUUID};
			projectDirPath = "";
			projectRoot = "";
			targets = (
				${targetUUID}T /* ${appName} */,
			);
		};
/* End PBXProject section */

/* Begin PBXResourcesBuildPhase section */
		${resourcesBuildPhaseUUID} /* Resources */ = {
			isa = PBXResourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				${assetsFileRefUUID}1 /* Assets.xcassets in Resources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXResourcesBuildPhase section */

/* Begin PBXSourcesBuildPhase section */
		${sourcesBuildPhaseUUID} /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				${appFileRefUUID}1 /* ${appName}App.swift in Sources */,
				${contentViewFileRefUUID}1 /* ContentView.swift in Sources */,
				${mainViewFileRefUUID}1 /* MainView.swift in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		${buildConfigDebugUUID} /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CODE_SIGN_STYLE = Automatic;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = dwarf;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				GCC_DYNAMIC_NO_PIC = NO;
				GCC_OPTIMIZATION_LEVEL = 0;
				GCC_PREPROCESSOR_DEFINITIONS = (
					"DEBUG=1",
					"$(inherited)",
				);
				IPHONEOS_DEPLOYMENT_TARGET = 17.0;
				MTL_ENABLE_DEBUG_INFO = INCLUDE_SOURCE;
				ONLY_ACTIVE_ARCH = YES;
				SDKROOT = iphoneos;
				SWIFT_ACTIVE_COMPILATION_CONDITIONS = DEBUG;
				SWIFT_OPTIMIZATION_LEVEL = "-Onone";
				SWIFT_VERSION = 5.0;
			};
			name = Debug;
		};
		${buildConfigReleaseUUID} /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				CLANG_ENABLE_MODULES = YES;
				CLANG_ENABLE_OBJC_ARC = YES;
				CODE_SIGN_STYLE = Automatic;
				COPY_PHASE_STRIP = NO;
				DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";
				ENABLE_NS_ASSERTIONS = NO;
				ENABLE_STRICT_OBJC_MSGSEND = YES;
				GCC_OPTIMIZATION_LEVEL = s;
				IPHONEOS_DEPLOYMENT_TARGET = 17.0;
				MTL_ENABLE_DEBUG_INFO = NO;
				SDKROOT = iphoneos;
				SWIFT_COMPILATION_MODE = wholemodule;
				SWIFT_OPTIMIZATION_LEVEL = "-O";
				SWIFT_VERSION = 5.0;
				VALIDATE_PRODUCT = YES;
			};
			name = Release;
		};
		${targetBuildConfigDebugUUID} /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = "UIInterfaceOrientationPortrait UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Debug;
		};
		${targetBuildConfigReleaseUUID} /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				ASSETCATALOG_COMPILER_GLOBAL_ACCENT_COLOR_NAME = AccentColor;
				INFOPLIST_KEY_UIApplicationSceneManifest_Generation = YES;
				INFOPLIST_KEY_UIApplicationSupportsIndirectInputEvents = YES;
				INFOPLIST_KEY_UILaunchScreen_Generation = YES;
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPad = "UIInterfaceOrientationPortrait UIInterfaceOrientationPortraitUpsideDown UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				INFOPLIST_KEY_UISupportedInterfaceOrientations_iPhone = "UIInterfaceOrientationPortrait UIInterfaceOrientationLandscapeLeft UIInterfaceOrientationLandscapeRight";
				LD_RUNPATH_SEARCH_PATHS = (
					"$(inherited)",
					"@executable_path/Frameworks",
				);
				PRODUCT_BUNDLE_IDENTIFIER = "${bundleId}";
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_EMIT_LOC_STRINGS = YES;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		${configListUUID} /* Build configuration list for PBXProject */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				${buildConfigDebugUUID} /* Debug */,
				${buildConfigReleaseUUID} /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		${targetConfigListUUID} /* Build configuration list for PBXNativeTarget */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				${targetBuildConfigDebugUUID} /* Debug */,
				${targetBuildConfigReleaseUUID} /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = ${projectUUID} /* Project object */;
}
`;

  return {
    [`${appName}.xcodeproj/project.pbxproj`]: pbxproj,
  };
}

function generateXcodeUUID(): string {
  return Array.from({ length: 24 }, () =>
    Math.floor(Math.random() * 16).toString(16).toUpperCase()
  ).join('');
}
