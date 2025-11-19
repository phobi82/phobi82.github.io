					// Which KitItem place where? -> [prefabPath,x,y,z], ...
					const kitItems = [
						["assets/prefabs/flightthruster_vs.prefab",   0.00, -0.8, -12],
						["assets/prefabs/flightthruster_vs.prefab",  -0.25, -0.8, -12],
						["assets/prefabs/flightthruster_vs.prefab",   0.00, -0.6, -12],
						["assets/prefabs/flightthruster_vs.prefab",  -0.25, -0.6, -12],
						//["assets/prefabs/drawtool.prefab",            1.80, -0.48,8.3],
						//["assets/prefabs/setgravitygadget_vs.prefab", 0.50, -0.8, -12],
						//["assets/prefabs/simplegun_vs.prefab",	-2.10, -0.8, -12.5] // DO NOT USE! disables one-shot
					];
					
					// prepare assetbundle as gameobject 
					const gadgetsGO = await BS.CreateGameObject(); 
					const assetBundle = await gadgetsGO.AddComponent(
						new BS.BanterAssetBundle(
							"https://phobi82.github.io/common/gadgets/kitbundle_standalonewindows_.banter",	// windowsUrl
							null, 				// osxUrl (not implemented yet)
							null,					// linuxUrl (not implemented yet)
							"https://phobi82.github.io/common/gadgets/kitbundle_android_.banter",				// androidUrl
							null,					// iosUrl (not implemented yet)
							null,					// vosUrl (not implemented yet)
							false,				// isScene
							false					// legacyShaderFix
						)
					);
					
					// create all gameobjects and transforms for position
					const objects = await Promise.all(
						kitItems.map(async ([path, x, y, z], idx) => {
							const go = await BS.CreateGameObject("Item_" + idx);
							const tr = await go.AddComponent(new BS.Transform());
							tr.position = new BS.Vector3(x, y, z);
							return { go, path };
						 })
					);
					// wait until assets loaded -> then add kitItems to gameobjects
					assetBundle.On("loaded", async () => {
						await Promise.all(
							objects.map(({ go, path }) =>
								go.AddComponent(new BS.BanterKitItem(path))
							)
						);
					});