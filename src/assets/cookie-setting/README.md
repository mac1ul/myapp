1. Document about the configuration file is
https://inside-docupedia.bosch.com/confluence/display/BDPROJECT/02+-+Cookie+Manager+V2#id-02-CookieManagerV2-Generalinformation

2. lesson learn about this configuration file:
* the key "domain" must be match to your server, for example, our domain for internal tools is "https://rb-mobileweb.de.bosch.com/"
So the value for "domain" needs to change from ".boschrexroth" to ".bosch.com"
* configuration file has difference version in D,Q,P system. Make sure the domain is correct in key "localizationDirPath"
* "url" can be customerized. But I suggest you align with the offical rexroth home page.

3. Remark
*  folder d-system, q-system, p-system is to store the configuration file for cookie manager. You can put your own configure file. But please remember to meet the requirement in https://inside-docupedia.bosch.com/confluence/display/BDPROJECT/02+-+Cookie+Manager+V2#id-02-CookieManagerV2-Generalinformation
