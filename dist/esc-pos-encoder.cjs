'use strict';

var linewrap = require('linewrap');
var canvas = require('canvas');
var Dither = require('canvas-dither');
var Flatten = require('canvas-flatten');

const definitions = {
  'cp437': {
    name: 'USA, Standard Europe',
    languages: ['en'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp720': {
    name: 'Arabic',
    languages: ['ar'],
    offset: 128,
    chars: '\x80\x81éâ\x84à\x86çêëèïî\x8d\x8e\x8f\x90\u0651\u0652ô¤ـûùءآأؤ£إئابةتثجحخدذرزسشص«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ضطظعغفµقكلمنهوىي≡\u064b\u064c\u064d\u064e\u064f\u0650≈°∙·√ⁿ²■\u00a0',
  },
  'cp737': {
    name: 'Greek',
    languages: ['el'],
    offset: 128,
    chars: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψ░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀ωάέήϊίόύϋώΆΈΉΊΌΎΏ±≥≤ΪΫ÷≈°∙·√ⁿ²■ ',
  },
  'cp775': {
    name: 'Baltic Rim',
    languages: ['et', 'lt'],
    offset: 128,
    chars: 'ĆüéāäģåćłēŖŗīŹÄÅÉæÆōöĢ¢ŚśÖÜø£Ø×¤ĀĪóŻżź”¦©®¬½¼Ł«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀ÓßŌŃõÕµńĶķĻļņĒŅ’­±“¾¶§÷„°∙·¹³²■ ',
  },
  'cp850': {
    name: 'Multilingual',
    languages: ['en'],
    offset: 128,
    chars: 'ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ ',
  },
  'cp851': {
    name: 'Greek',
    languages: ['el'],
    offset: 128,
    chars: 'ÇüéâäàΆçêëèïîΈÄΉΊ ΌôöΎûùΏÖÜά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ´­±υφχ§ψ¸°¨ωϋΰώ■ ',
  },
  'cp852': {
    name: 'Latin 2',
    languages: ['hu', 'pl', 'cz'],
    offset: 128,
    chars: 'ÇüéâäůćçłëŐőîŹÄĆÉĹĺôöĽľŚśÖÜŤťŁ×čáíóúĄąŽžĘę¬źČş«»░▒▓│┤ÁÂĚŞ╣║╗╝Żż┐└┴┬├─┼Ăă╚╔╩╦╠═╬¤đĐĎËďŇÍÎě┘┌█▄ŢŮ▀ÓßÔŃńňŠšŔÚŕŰýÝţ´­˝˛ˇ˘§÷¸°¨˙űŘř■ ',
  },
  'cp853': {
    name: 'Turkish',
    languages: ['tr'],
    offset: 128,
    chars: 'ÇüéâäàĉçêëèïîìÄĈÉċĊôöòûùİÖÜĝ£Ĝ×ĵáíóúñÑĞğĤĥ�½Ĵş«»░▒▓│┤ÁÂÀŞ╣║╗╝Żż┐└┴┬├─┼Ŝŝ╚╔╩╦╠═╬¤��ÊËÈıÍÎÏ┘┌█▄�Ì▀ÓßÔÒĠġµĦħÚÛÙŬŭ�´­�ℓŉ˘§÷¸°¨˙�³²■ ',
  },
  'cp855': {
    name: 'Cyrillic',
    languages: ['bg'],
    offset: 128,
    chars: 'ђЂѓЃёЁєЄѕЅіІїЇјЈљЉњЊћЋќЌўЎџЏюЮъЪаАбБцЦдДеЕфФгГ«»░▒▓│┤хХиИ╣║╗╝йЙ┐└┴┬├─┼кК╚╔╩╦╠═╬¤лЛмМнНоОп┘┌█▄Пя▀ЯрРсСтТуУжЖвВьЬ№­ыЫзЗшШэЭщЩчЧ§■ ',
  },
  'cp857': {
    name: 'Turkish',
    languages: ['tr'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜø£ØŞşáíóúñÑĞğ¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ºªÊËÈ�ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµ�×ÚÛÙìÿ¯´­±�¾¶§÷¸°¨·¹³²■ ',
  },
  'cp858': {
    name: 'Euro',
    languages: ['en'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈ€ÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ',
  },
  'cp860': {
    name: 'Portuguese',
    languages: ['pt'],
    offset: 128,
    chars: 'ÇüéâãàÁçêÊèÍÔìÃÂÉÀÈôõòÚùÌÕÜ¢£Ù₧ÓáíóúñÑªº¿Ò¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp861': {
    name: 'Icelandic',
    languages: ['is'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèÐðÞÄÅÉæÆôöþûÝýÖÜø£Ø₧ƒáíóúÁÍÓÚ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp862': {
    name: 'Hebrew',
    languages: ['he'],
    offset: 128,
    chars: 'אבגדהוזחטיךכלםמןנסעףפץצקרשת¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp863': {
    name: 'Canadian French',
    languages: ['fr'],
    offset: 128,
    chars: 'ÇüéâÂà¶çêëèïî‗À§ÉÈÊôËÏûù¤ÔÜ¢£ÙÛƒ¦´óú¨¸³¯Î⌐¬½¼¾«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp864': {
    name: 'Arabic',
    languages: ['ar'],
    offset: 0,
    chars: '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !"#$٪&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~°·∙√▒─│┼┤┬├┴┐┌└┘β∞φ±½¼≈«»ﻷﻸ��ﻻﻼ� ­ﺂ£¤ﺄ��ﺎﺏﺕﺙ،ﺝﺡﺥ٠١٢٣٤٥٦٧٨٩ﻑ؛ﺱﺵﺹ؟¢ﺀﺁﺃﺅﻊﺋﺍﺑﺓﺗﺛﺟﺣﺧﺩﺫﺭﺯﺳﺷﺻﺿﻁﻅﻋﻏ¦¬÷×ﻉـﻓﻗﻛﻟﻣﻧﻫﻭﻯﻳﺽﻌﻎﻍﻡﹽّﻥﻩﻬﻰﻲﻐﻕﻵﻶﻝﻙﻱ■�',
  },
  'cp865': {
    name: 'Nordic',
    languages: ['sv', 'dk'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø₧ƒáíóúñÑªº¿⌐¬½¼¡«¤░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp866': {
    name: 'Cyrillic 2',
    languages: ['ru'],
    offset: 128,
    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёЄєЇїЎў°∙·√№¤■ ',
  },
  'cp869': {
    name: 'Greek',
    languages: ['el'],
    offset: 128,
    chars: '������Ά�·¬¦‘’Έ―ΉΊΪΌ��ΎΫ©Ώ²³ά£έήίϊΐόύΑΒΓΔΕΖΗ½ΘΙ«»░▒▓│┤ΚΛΜΝ╣║╗╝ΞΟ┐└┴┬├─┼ΠΡ╚╔╩╦╠═╬ΣΤΥΦΧΨΩαβγ┘┌█▄δε▀ζηθικλμνξοπρσςτ΄­±υφχ§ψ΅°¨ωϋΰώ■ ',
  },
  'cp874': {
    name: 'Thai',
    languages: ['th'],
    offset: 128,
    chars: '€����…�����������‘’“”•–—�������� กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����',
  },
  'cp1098': {
    name: 'Farsi',
    languages: ['fa'],
    offset: 128,
    chars: '\u0020\u0020\u060c\u061b\u061f\u064b\u0622\ufe82\uf8fa\u0627\ufe8e\uf8fb\u0621\u0623\ufe84\uf8f9\u0624\ufe8b\u0628\ufe91\ufb56\ufb58\u062a\ufe97\u062b\ufe9b\u062c\ufe9f\ufb7a\ufb7c\u00d7\u062d\ufea3\u062e\ufea7\u062f\u0630\u0631\u0632\ufb8a\u0633\ufeb3\u0634\ufeb7\u0635\ufebb\u00ab\u00bb\u2591\u2592\u2593\u2502\u2524\u0636\ufebf\ufec1\ufec3\u2563\u2551\u2557\u255d\u00a4\ufec5\u2510\u2514\u2534\u252c\u251c\u2500\u253c\ufec7\u0639\u255a\u2554\u2569\u2566\u2560\u2550\u256c\u0020\ufeca\ufecb\ufecc\u063a\ufece\ufecf\ufed0\u0641\ufed3\u2518\u250c\u2588\u2584\u0642\ufed7\u2580\ufb8e\ufedb\ufb92\ufb94\u0644\ufedf\u0645\ufee3\u0646\ufee7\u0648\u0647\ufeeb\ufeec\ufba4\ufbfc\u00ad\ufbfd\ufbfe\u0640\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669\u25a0\u00a0',
  },
  'cp1118': {
    name: 'Lithuanian',
    languages: ['lt'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀αβΓπΣσµτΦΘΩδ∞φε⋂≡±≥≤„“÷≈°∙˙√ⁿ²■ ',
  },
  'cp1119': {
    name: 'Lithuanian',
    languages: ['lt'],
    offset: 128,
    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤ĄČĘĖ╣║╗╝ĮŠ┐└┴┬├─┼ŲŪ╚╔╩╦╠═╬Žąčęėįšųūž┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁё≥≤„“÷≈°∙·√ⁿ²■ ',
  },
  'cp1125': {
    name: 'Ukrainian',
    languages: ['uk'],
    offset: 128,
    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюяЁёҐґЄєІіЇї·√№¤■ ',
  },
  'cp1162': {
    name: 'Thai',
    languages: ['th'],
    offset: 128,
    chars: '€…‘’“”•–— กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุู����฿เแโใไๅๆ็่้๊๋์ํ๎๏๐๑๒๓๔๕๖๗๘๙๚๛����',
  },
  'cp2001': {
    name: 'Lithuanian KBL or 771',
    languages: ['lt'],
    offset: 128,
    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█ĄąČčрстуфхцчшщъыьэюяĘęĖėĮįŠšŲųŪūŽž■ ',
  },
  'cp3001': {
    name: 'Estonian 1 or 1116',
    languages: ['et'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤šŠÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµžŽÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ',
  },
  'cp3002': {
    name: 'Estonian 2',
    languages: ['et'],
    offset: 128,
    chars: ' ¡¢£¤¥¦§¨©ª«¬­®‾°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏŠÑÒÓÔÕÖ×ØÙÚÛÜÝŽßàáâãäåæçèéêëìíîïšñòóôõö÷øùúûüýžÿ',
  },
  'cp3011': {
    name: 'Latvian 1',
    languages: ['lv'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤Ā╢ņ╕╣║╗╝╜╛┐└┴┬├─┼ā╟╚╔╩╦╠═╬╧Š╤čČ╘╒ģĪī┘┌█▄ūŪ▀αßΓπΣσµτΦΘΩδ∞φε∩ĒēĢķĶļĻžŽ∙·√Ņš■ ',
  },
  'cp3012': {
    name: 'Latvian 2 (modified 866)',
    languages: ['lv'],
    offset: 128,
    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤Ā╢ņ╕╣║╗╝Ō╛┐└┴┬├─┼ā╟╚╔╩╦╠═╬╧Š╤čČ╘╒ģĪī┘┌█▄ūŪ▀рстуфхцчшщъыьэюяĒēĢķĶļĻžŽō·√Ņš■ ',
  },
  'cp3021': {
    name: 'Bulgarian (MIK)',
    languages: ['bg'],
    offset: 128,
    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя└┴┬├─┼╣║╚╔╩╦╠═╬┐░▒▓│┤№§╗╝┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp3041': {
    name: 'Maltese ISO 646',
    languages: ['mt'],
    offset: 0,
    chars: '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZġżħ^_ċabcdefghijklmnopqrstuvwxyzĠŻĦĊ\u007F',
  },
  'cp3840': {
    name: 'Russian (modified 866)',
    languages: ['ru'],
    offset: 128,
    chars: 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмноп░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀рстуфхцчшщъыьэюя≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp3841': {
    name: 'Ghost',
    languages: ['ru'],
    offset: 128,
    chars: 'ғәёіїјҝөўүӽӈҹҷє£ҒӘЁІЇЈҜӨЎҮӼӇҸҶЄЪ !"#$%&\'()*+,-./0123456789:;<=>?юабцдефгхийклмнопярстужвьызшэщчъЮАБЦДЕФГХИЙКЛМНОПЯРСТУЖВЬЫЗШЭЩЧ∅',
  },
  'cp3843': {
    name: 'Polish (Mazovia)',
    languages: ['pl'],
    offset: 128,
    chars: 'ÇüéâäàąçêëèïîćÄĄĘęłôöĆûùŚÖÜ¢Ł¥śƒŹŻóÓńŃźż¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp3844': {
    name: 'Czech (Kamenický)',
    languages: ['cz'],
    offset: 128,
    chars: 'ČüéďäĎŤčěĚĹÍľĺÄÁÉžŽôöÓůÚýÖÜŠĽÝŘťáíóúňŇŮÔšřŕŔ¼§«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp3845': {
    name: 'Hungarian (CWI-2)',
    languages: ['hu'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîÍÄÁÉæÆőöÓűÚŰÖÜ¢£¥₧ƒáíóúñÑªŐ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp3846': {
    name: 'Turkish',
    languages: ['tr'],
    offset: 128,
    chars: 'ÇüéâäàåçêëèïîıÄÅÉæÆôöòûùİÖÜ¢£¥ŞşáíóúñÑĞğ¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ',
  },
  'cp3847': {
    name: 'Brazil ABNT',
    languages: ['pt'],
    offset: 256,
    chars: '',
  },
  'cp3848': {
    name: 'Brazil ABICOMP',
    languages: ['pt'],
    offset: 160,
    chars: ' ÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖŒÙÚÛÜŸ¨£¦§°¡àáâãäçèéêëìíîïñòóôõöœùúûüÿßªº¿±',
  },
  'iso88591': {
    name: 'Latin 1',
    languages: ['en'],
    offset: 128,
    chars: ' ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ',
  },
  'iso88592': {
    name: 'Latin 2',
    languages: ['hu', 'pl', 'cz'],
    offset: 128,
    chars: ' Ą˘Ł¤ĽŚ§¨ŠŞŤŹ­ŽŻ°ą˛ł´ľśˇ¸šşťź˝žżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙',
  },
  'iso88597': {
    name: 'Greek',
    languages: ['el'],
    offset: 128,
    chars: ' ‘’£€₯¦§¨©ͺ«¬­�―°±²³΄΅Ά·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�',
  },
  'iso885915': {
    name: 'Latin 9',
    languages: ['fr'],
    offset: 128,
    chars: ' ¡¢£€¥Š§š©ª«¬­®¯°±²³Žµ¶·ž¹º»ŒœŸ¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ',
  },
  'rk1048': {
    name: 'Kazakh',
    languages: ['kk'],
    offset: 128,
    chars: 'ЂЃ‚ѓ„…†‡€‰Љ‹ЊҚҺЏђ‘’“”•–—�™љ›њқһџ ҰұӘ¤Ө¦§Ё©Ғ«¬­®Ү°±Ііөµ¶·ё№ғ»әҢңүАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя',
  },
  'windows1250': {
    name: 'Latin 2',
    languages: ['hu', 'pl', 'cz'],
    offset: 128,
    chars: '€�‚�„…†‡�‰Š‹ŚŤŽŹ�‘’“”•–—�™š›śťžź ˇ˘Ł¤Ą¦§¨©Ş«¬­®Ż°±˛ł´µ¶·¸ąş»Ľ˝ľżŔÁÂĂÄĹĆÇČÉĘËĚÍÎĎĐŃŇÓÔŐÖ×ŘŮÚŰÜÝŢßŕáâăäĺćçčéęëěíîďđńňóôőö÷řůúűüýţ˙',
  },
  'windows1251': {
    name: 'Cyrillic',
    languages: ['ru'],
    offset: 128,
    chars: 'ЂЃ‚ѓ„…†‡€‰Љ‹ЊЌЋЏђ‘’“”•–—�™љ›њќћџ ЎўЈ¤Ґ¦§Ё©Є«¬­®Ї°±Ііґµ¶·ё№є»јЅѕїАБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя',
  },
  'windows1252': {
    name: 'Latin',
    languages: ['fr'],
    offset: 128,
    chars: '€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ',
  },
  'windows1253': {
    name: 'Greek',
    languages: ['el'],
    offset: 128,
    chars: '€�‚ƒ„…†‡�‰�‹�����‘’“”•–—�™�›���� ΅Ά£¤¥¦§¨©�«¬­®―°±²³΄µ¶·ΈΉΊ»Ό½ΎΏΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡ�ΣΤΥΦΧΨΩΪΫάέήίΰαβγδεζηθικλμνξοπρςστυφχψωϊϋόύώ�',
  },
  'windows1254': {
    name: 'Turkish',
    languages: ['tr'],
    offset: 128,
    chars: '€�‚ƒ„…†‡ˆ‰Š‹Œ����‘’“”•–—˜™š›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏĞÑÒÓÔÕÖ×ØÙÚÛÜİŞßàáâãäåæçèéêëìíîïğñòóôõö÷øùúûüışÿ',
  },
  'windows1255': {
    name: 'Hebrew',
    languages: ['he'],
    offset: 128,
    chars: '€�‚ƒ„…†‡ˆ‰�‹�����‘’“”•–—˜™�›���� ¡¢£₪¥¦§¨©×«¬­®¯°±²³´µ¶·¸¹÷»¼½¾¿ְֱֲֳִֵֶַָֹֺֻּֽ־ֿ׀ׁׂ׃װױײ׳״�������אבגדהוזחטיךכלםמןנסעףפץצקרשת��‎‏�',
  },
  'windows1256': {
    name: 'Arabic',
    languages: ['ar'],
    offset: 128,
    chars: '€پ‚ƒ„…†‡ˆ‰ٹ‹Œچژڈگ‘’“”•–—ک™ڑ›œ‌‍ں ،¢£¤¥¦§¨©ھ«¬­®¯°±²³´µ¶·¸¹؛»¼½¾؟ہءآأؤإئابةتثجحخدذرزسشصض×طظعغـفقكàلâمنهوçèéêëىيîïًٌٍَôُِ÷ّùْûü‎‏ے',
  },
  'windows1257': {
    name: 'Baltic Rim',
    languages: ['et', 'lt'],
    offset: 128,
    chars: '€�‚�„…†‡�‰�‹�¨ˇ¸�‘’“”•–—�™�›�¯˛� �¢£¤�¦§Ø©Ŗ«¬­®Æ°±²³´µ¶·ø¹ŗ»¼½¾æĄĮĀĆÄÅĘĒČÉŹĖĢĶĪĻŠŃŅÓŌÕÖ×ŲŁŚŪÜŻŽßąįāćäåęēčéźėģķīļšńņóōõö÷ųłśūüżž˙',
  },
  'windows1258': {
    name: 'Vietnamese',
    languages: ['vi'],
    offset: 128,
    chars: '€�‚ƒ„…†‡ˆ‰�‹Œ����‘’“”•–—˜™�›œ��Ÿ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂĂÄÅÆÇÈÉÊË̀ÍÎÏĐÑ̉ÓÔƠÖ×ØÙÚÛÜỮßàáâăäåæçèéêë́íîïđṇ̃óôơö÷øùúûüư₫ÿ',
  },
  'tcvn': {
    name: 'TCVN',
    languages: ['vitcvn'],
    offset: 0,
    chars: '\u0000ÚỤ\u0003ỪỬỮ\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010ỨỰỲỶỸÝỴ\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÀẢÃÁẠẶẬÈẺẼÉẸỆÌỈĨÍỊÒỎÕÓỌỘỜỞỠỚỢÙỦŨ ĂÂÊÔƠƯĐăâêôơưđẶ̀̀̉̃́àảãáạẲằẳẵắẴẮẦẨẪẤỀặầẩẫấậèỂẻẽéẹềểễếệìỉỄẾỒĩíịòỔỏõóọồổỗốộờởỡớợùỖủũúụừửữứựỳỷỹýỵỐ',
  },
};

const strings = {
  en: 'The quick brown fox jumps over the lazy dog.',
  jp: 'イロハニホヘト チリヌルヲ ワカヨタレソ ツネナラム',
  pt: 'O próximo vôo à noite sobre o Atlântico, põe freqüentemente o único médico.',
  fr: 'Les naïfs ægithales hâtifs pondant à Noël où il gèle sont sûrs d\'être déçus en voyant leurs drôles d\'œufs abîmés.',
  sv: 'Flygande bäckasiner söka strax hwila på mjuka tuvor.',
  dk: 'Quizdeltagerne spiste jordbær med fløde',
  el: 'ξεσκεπάζω την ψυχοφθόρα βδελυγμία',
  tr: 'Pijamalı hasta, yağız şoföre çabucak güvendi.',
  ru: 'Съешь же ещё этих мягких французских булок да выпей чаю',
  hu: 'Árvíztűrő tükörfúrógép',
  pl: 'Pchnąć w tę łódź jeża lub ośm skrzyń fig',
  cz: 'Mohu jíst sklo, neublíží mi.',
  ar: 'أنا قادر على أكل الزجاج و هذا لا يؤلمني.',
  et: 'Ma võin klaasi süüa, see ei tee mulle midagi.',
  lt: 'Aš galiu valgyti stiklą ir jis manęs nežeidžia.',
  bg: 'Мога да ям стъкло, то не ми вреди.',
  is: 'Ég get etið gler án þess að meiða mig.',
  he: 'אני יכול לאכול זכוכית וזה לא מזיק לי.',
  fa: '.من می توانم بدونِ احساس درد شيشه بخورم',
  uk: 'Я можу їсти скло, і воно мені не зашкодить.',
  vi: 'Chào các bạn tôi tên là lý nguyễn minh bảo',
  vitcvn: 'Chào các bạn tôi tên là lý nguyễn minh bảo',
  kk: 'қазақша',
  lv: 'Es varu ēst stiklu, tas man nekaitē.',
  mt: 'Nista\' niekol il-ħġieġ u ma jagħmilli xejn.',
  th: 'ฉันกินกระจกได้ แต่มันไม่ทำให้ฉันเจ็บ',
};

/**
 * A library for converting Unicode to obscure single byte codepage for use with thermal printers
 */
class CodepageEncoder {
  /**
     * Get list of supported codepages
     *
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  static getEncodings() {
    return Object.keys(definitions);
  }

  /**
     * Get test strings for the specified codepage
     *
     * @param  {string}   codepage  The codepage
     * @return {array}              Return an array with one or more objects
     *                              containing a property for the language of
     *                              the string and a property for the string itself
     *
     */
  static getTestStrings(codepage) {
    if (typeof definitions[codepage] !== 'undefined' &&
            typeof definitions[codepage].languages !== 'undefined') {
      return definitions[codepage].languages.map((i) => ({language: i, string: strings[i]}));
    }

    return [];
  }

  /**
     * Determine if the specified codepage is supported
     *
     * @param  {string}   codepage  The codepage
     * @return {boolean}            Return a boolean, true if the encoding is supported,
     *                              otherwise false
     *
     */
  static supports(codepage) {
    if (typeof definitions[codepage] === 'undefined') {
      return false;
    }

    if (typeof definitions[codepage].chars === 'undefined') {
      return false;
    }

    return true;
  }

  /**
     * Encode a string in the specified codepage
     *
     * @param  {string}   input     Text that needs encoded to the specified codepage
     * @param  {string}   codepage  The codepage
     * @return {Uint8Array}         Return an array of bytes with the encoded string
     *
     */
  static encode(input, codepage) {
    const output = new Uint8Array(input.length);

    let chars = '\u0000'.repeat(128);
    let offset = 128;

    if (typeof definitions[codepage] !== 'undefined' &&
            typeof definitions[codepage].chars !== 'undefined') {
      chars = definitions[codepage].chars;
      offset = definitions[codepage].offset;
    }

    for (let c = 0; c < input.length; c++) {
      const codepoint = input.codePointAt(c);

      if (codepoint < 128) {
        output[c] = codepoint;
      } else {
        const position = chars.indexOf(input[c]);

        if (position !== -1) {
          output[c] = offset + position;
        } else if (codepoint < 256 && (codepoint < offset || codepoint >= offset + chars.length)) {
          output[c] = codepoint;
        } else {
          output[c] = 0x3f;
        }
      }
    }

    return output;
  }


  /**
     * Encode a string in the most optimal set of codepages.
     *
     * @param  {string}   input         Text that needs encoded
     * @param  {array}    candidates    An array of candidate codepages that are allowed to be used, ranked by importance
     * @return {Uint8Array}             Return an array of bytes with the encoded string
     *
     */
  static autoEncode(input, candidates) {
    const fragments = [];
    let fragment = -1;
    let current;

    for (let c = 0; c < input.length; c++) {
      const codepoint = input.codePointAt(c);

      let available;
      let char = 0;

      if (codepoint < 128) {
        available = current || candidates[0];
        char = codepoint;
      }

      if (!available && current) {
        const position = definitions[current].chars.indexOf(input[c]);

        if (position !== -1) {
          available = current;
          char = definitions[current].offset + position;
        }
      }

      if (!available) {
        for (let i = 0; i < candidates.length; i++) {
          const position = definitions[candidates[i]].chars.indexOf(input[c]);

          if (position !== -1) {
            available = candidates[i];
            char = definitions[candidates[i]].offset + position;
            break;
          }
        }
      }

      if (!available) {
        available = current || candidates[0];
        char = 0x3f;
      }

      if (current != available) {
        if (current) {
          fragments[fragment].bytes = new Uint8Array(fragments[fragment].bytes);
        }

        fragment++;
        fragments[fragment] = {
          codepage: available,
          bytes: [],
        };

        current = available;
      }

      fragments[fragment].bytes.push(char);
    }

    if (current) {
      fragments[fragment].bytes = new Uint8Array(fragments[fragment].bytes);
    }

    return fragments;
  }
}

const codepageMappings = {
  epson: {
    'cp437': 0x00,
    'shiftjis': 0x01,
    'cp850': 0x02,
    'cp860': 0x03,
    'cp863': 0x04,
    'cp865': 0x05,
    'cp851': 0x0b,
    'cp853': 0x0c,
    'cp857': 0x0d,
    'cp737': 0x0e,
    'iso88597': 0x0f,
    'windows1252': 0x10,
    'cp866': 0x11,
    'cp852': 0x12,
    'cp858': 0x13,
    'cp720': 0x20,
    'cp775': 0x21,
    'cp855': 0x22,
    'cp861': 0x23,
    'cp862': 0x24,
    'cp864': 0x25,
    'cp869': 0x26,
    'iso88592': 0x27,
    'iso885915': 0x28,
    'cp1098': 0x29,
    'cp1118': 0x2a,
    'cp1119': 0x2b,
    'cp1125': 0x2c,
    'windows1250': 0x2d,
    'windows1251': 0x2e,
    'windows1253': 0x2f,
    'windows1254': 0x30,
    'windows1255': 0x31,
    'windows1256': 0x32,
    'windows1257': 0x33,
    'windows1258': 0x34,
    'rk1048': 0x35,
    'tcvn': 0x1b,
  },

  zjiang: {
    'cp437': 0x00,
    'shiftjis': 0x01,
    'cp850': 0x02,
    'cp860': 0x03,
    'cp863': 0x04,
    'cp865': 0x05,
    'windows1252': 0x10,
    'cp866': 0x11,
    'cp852': 0x12,
    'cp858': 0x13,
    'windows1255': 0x20,
    'cp861': 0x38,
    'cp855': 0x3c,
    'cp857': 0x3d,
    'cp862': 0x3e,
    'cp864': 0x3f,
    'cp737': 0x40,
    'cp851': 0x41,
    'cp869': 0x42,
    'cp1119': 0x44,
    'cp1118': 0x45,
    'windows1250': 0x48,
    'windows1251': 0x49,
    'cp3840': 0x4a,
    'cp3843': 0x4c,
    'cp3844': 0x4d,
    'cp3845': 0x4e,
    'cp3846': 0x4f,
    'cp3847': 0x50,
    'cp3848': 0x51,
    'cp2001': 0x53,
    'cp3001': 0x54,
    'cp3002': 0x55,
    'cp3011': 0x56,
    'cp3012': 0x57,
    'cp3021': 0x58,
    'cp3041': 0x59,
    'windows1253': 0x5a,
    'windows1254': 0x5b,
    'windows1256': 0x5c,
    'cp720': 0x5d,
    'windows1258': 0x5e,
    'cp775': 0x5f,
    'tcvn': 0x1b,
  },

  bixolon: {
    'cp437': 0x00,
    'shiftjis': 0x01,
    'cp850': 0x02,
    'cp860': 0x03,
    'cp863': 0x04,
    'cp865': 0x05,
    'cp851': 0x0b,
    'cp858': 0x13,
    'tcvn': 0x1b,
  },

  star: {
    'cp437': 0x00,
    'shiftjis': 0x01,
    'cp850': 0x02,
    'cp860': 0x03,
    'cp863': 0x04,
    'cp865': 0x05,
    'windows1252': 0x10,
    'cp866': 0x11,
    'cp852': 0x12,
    'cp858': 0x13,
    'tcvn': 0x1b,
  },

  citizen: {
    'cp437': 0x00,
    'shiftjis': 0x01,
    'cp850': 0x02,
    'cp860': 0x03,
    'cp863': 0x04,
    'cp865': 0x05,
    'cp852': 0x12,
    'cp866': 0x11,
    'cp857': 0x08,
    'windows1252': 0x10,
    'cp858': 0x13,
    'cp864': 0x28,
    'tcvn': 0x1b,
  },

  legacy: {
    'cp437': 0x00,
    'cp737': 0x40,
    'cp850': 0x02,
    'cp775': 0x5f,
    'cp852': 0x12,
    'cp855': 0x3c,
    'cp857': 0x3d,
    'cp858': 0x13,
    'cp860': 0x03,
    'cp861': 0x38,
    'cp862': 0x3e,
    'cp863': 0x04,
    'cp864': 0x1c,
    'cp865': 0x05,
    'cp866': 0x11,
    'cp869': 0x42,
    'cp936': 0xff,
    'cp949': 0xfd,
    'cp950': 0xfe,
    'cp1252': 0x10,
    'iso88596': 0x16,
    'shiftjis': 0xfc,
    'windows874': 0x1e,
    'windows1250': 0x48,
    'windows1251': 0x49,
    'windows1252': 0x47,
    'windows1253': 0x5a,
    'windows1254': 0x5b,
    'windows1255': 0x20,
    'windows1256': 0x5c,
    'windows1257': 0x19,
    'windows1258': 0x5e,
    'tcvn': 0x1b,
  },
};


/**
 * Create a byte stream based on commands for ESC/POS printers
 */
class EscPosEncoder {
  /**
     * Create a new object
     *
     * @param  {object}   options   Object containing configuration options
    */
  constructor(options) {
    this._reset(options);
  }

  /**
     * Reset the state of the object
     *
     * @param  {object}   options   Object containing configuration options
    */
  _reset(options) {
    this._options = Object.assign({
      width: null,
      embedded: false,
      wordWrap: true,
      imageMode: 'column',
      codepageMapping: 'epson',
      codepageCandidates: [
        'cp437', 'cp858', 'cp860', 'cp861', 'cp863', 'cp865',
        'cp852', 'cp857', 'cp855', 'cp866', 'cp869',
      ],
    }, options);

    this._embedded = this._options.width && this._options.embedded;

    this._buffer = [];
    this._queued = [];
    this._cursor = 0;
    this._codepage = 'ascii';

    this._state = {
      'codepage': 0,
      'align': 'left',
      'bold': false,
      'italic': false,
      'underline': false,
      'invert': false,
      'width': 1,
      'height': 1,
    };
  }

  /**
     * Encode a string with the current code page
     *
     * @param  {string}   value  String to encode
     * @return {object}          Encoded string as a ArrayBuffer
     *
    */
  _encode(value) {
    if (this._codepage != 'auto') {
      return CodepageEncoder.encode(value, this._codepage);
    }

    let codepages;

    if (typeof this._options.codepageMapping == 'string') {
      codepages = codepageMappings[this._options.codepageMapping];
    } else {
      codepages = this._options.codepageMapping;
    }

    const fragments = CodepageEncoder.autoEncode(value, this._options.codepageCandidates);

    let length = 0;
    for (let f = 0; f < fragments.length; f++) {
      length += 3 + fragments[f].bytes.byteLength;
    }

    const buffer = new Uint8Array(length);
    let i = 0;

    for (let f = 0; f < fragments.length; f++) {
      buffer.set([0x1b, 0x74, codepages[fragments[f].codepage]], i);
      buffer.set(fragments[f].bytes, i + 3);
      i += 3 + fragments[f].bytes.byteLength;

      this._state.codepage = codepages[fragments[f].codepage];
    }

    return buffer;
  }

  /**
     * Add commands to the queue
     *
     * @param  {array}   value  Add array of numbers, arrays, buffers or Uint8Arrays to add to the buffer
     *
    */
  _queue(value) {
    value.forEach((item) => this._queued.push(item));
  }

  /**
     * Flush current queue to the buffer
     *
    */
  _flush() {
    if (this._embedded) {
      let indent = this._options.width - this._cursor;

      if (this._state.align == 'left') {
        this._queued.push((new Array(indent)).fill(0x20));
      }

      if (this._state.align == 'center') {
        const remainder = indent % 2;
        indent = indent >> 1;

        if (indent > 0) {
          this._queued.push((new Array(indent)).fill(0x20));
        }

        if (indent + remainder > 0) {
          this._queued.unshift((new Array(indent + remainder)).fill(0x20));
        }
      }

      if (this._state.align == 'right') {
        this._queued.unshift((new Array(indent)).fill(0x20));
      }
    }

    this._buffer = this._buffer.concat(this._queued);

    this._queued = [];
    this._cursor = 0;
  }

  /**
     * Wrap the text while respecting the position of the cursor
     *
     * @param  {string}   value     String to wrap after the width of the paper has been reached
     * @param  {number}   position  Position on which to force a wrap
     * @return {array}              Array with each line
    */
  _wrap(value, position) {
    if (position || (this._options.wordWrap && this._options.width)) {
      const indent = '-'.repeat(this._cursor);
      const w = linewrap(position || this._options.width, {lineBreak: '\n', whitespace: 'all'});
      const result = w(indent + value).substring(this._cursor).split('\n');

      return result;
    }

    return [value];
  }

  /**
     * Restore styles and codepages after drawing boxes or lines
    */
  _restoreState() {
    this.bold(this._state.bold);
    this.italic(this._state.italic);
    this.underline(this._state.underline);
    this.invert(this._state.invert);

    this._queue([
      0x1b, 0x74, this._state.codepage,
    ]);
  }

  /**
     * Get code page identifier for the specified code page and mapping
     *
     * @param  {string}   codepage  Required code page
     * @return {number}             Identifier for the current printer according to the specified mapping
    */
  _getCodepageIdentifier(codepage) {
    let codepages;

    if (typeof this._options.codepageMapping == 'string') {
      codepages = codepageMappings[this._options.codepageMapping];
    } else {
      codepages = this._options.codepageMapping;
    }

    return codepages[codepage];
  }


  /**
     * Initialize the printer
     *
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  initialize() {
    this._queue([
      0x1b, 0x40,
    ]);

    this._flush();

    return this;
  }

  /**
     * Change the code page
     *
     * @param  {string}   codepage  The codepage that we set the printer to
     * @return {object}             Return the object, for easy chaining commands
     *
     */
  codepage(codepage) {
    if (codepage === 'auto') {
      this._codepage = codepage;
      return this;
    }

    if (!CodepageEncoder.supports(codepage)) {
      throw new Error('Unknown codepage');
    }

    let codepages;

    if (typeof this._options.codepageMapping == 'string') {
      codepages = codepageMappings[this._options.codepageMapping];
    } else {
      codepages = this._options.codepageMapping;
    }

    if (typeof codepages[codepage] !== 'undefined') {
      this._codepage = codepage;
      this._state.codepage = codepages[codepage];

      this._queue([
        0x1b, 0x74, codepages[codepage],
      ]);
    } else {
      throw new Error('Codepage not supported by printer');
    }

    return this;
  }

  /**
     * Print text
     *
     * @param  {string}   value  Text that needs to be printed
     * @param  {number}   wrap   Wrap text after this many positions
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  text(value, wrap) {
    const lines = this._wrap(value, wrap);

    for (let l = 0; l < lines.length; l++) {
      const bytes = this._encode(lines[l]);

      this._queue([
        bytes,
      ]);

      this._cursor += (lines[l].length * this._state.width);

      if (this._options.width && !this._embedded) {
        this._cursor = this._cursor % this._options.width;
      }

      if (l < lines.length - 1) {
        this.newline();
      }
    }

    return this;
  }

  /**
     * Print a newline
     *
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  newline() {
    this._flush();

    this._queue([
      0x0a, 0x0d,
    ]);

    if (this._embedded) {
      this._restoreState();
    }

    return this;
  }

  /**
     * Print text, followed by a newline
     *
     * @param  {string}   value  Text that needs to be printed
     * @param  {number}   wrap   Wrap text after this many positions
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  line(value, wrap) {
    this.text(value, wrap);
    this.newline();

    return this;
  }

  /**
     * Underline text
     *
     * @param  {boolean|number}   value  true to turn on underline, false to turn off, or 2 for double underline
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  underline(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.underline;
    }

    this._state.underline = value;

    this._queue([
      0x1b, 0x2d, Number(value),
    ]);

    return this;
  }

  /**
     * Italic text
     *
     * @param  {boolean}          value  true to turn on italic, false to turn off
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  italic(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.italic;
    }

    this._state.italic = value;

    this._queue([
      0x1b, 0x34, Number(value),
    ]);

    return this;
  }

  /**
     * Bold text
     *
     * @param  {boolean}          value  true to turn on bold, false to turn off
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  bold(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.bold;
    }

    this._state.bold = value;

    this._queue([
      0x1b, 0x45, Number(value),
    ]);

    return this;
  }

  /**
     * Change width of text
     *
     * @param  {number}          width    The width of the text, 1 - 8
     * @return {object}                   Return the object, for easy chaining commands
     *
     */
  width(width) {
    if (typeof width === 'undefined') {
      width = 1;
    }

    if (typeof width !== 'number') {
      throw new Error('Width must be a number');
    }

    if (width < 1 || width > 8) {
      throw new Error('Width must be between 1 and 8');
    }

    this._state.width = width;

    this._queue([
      0x1d, 0x21, (this._state.height - 1) | (this._state.width - 1) << 4,
    ]);

    return this;
  }

  /**
     * Change height of text
     *
     * @param  {number}          height  The height of the text, 1 - 8
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  height(height) {
    if (typeof height === 'undefined') {
      height = 1;
    }

    if (typeof height !== 'number') {
      throw new Error('Height must be a number');
    }

    if (height < 1 || height > 8) {
      throw new Error('Height must be between 1 and 8');
    }

    this._state.height = height;

    this._queue([
      0x1d, 0x21, (this._state.height - 1) | (this._state.width - 1) << 4,
    ]);

    return this;
  }

  /**
     * Invert text
     *
     * @param  {boolean}          value  true to turn on white text on black, false to turn off
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  invert(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.invert;
    }

    this._state.invert = value;

    this._queue([
      0x1d, 0x42, Number(value),
    ]);

    return this;
  }

  /**
     * Change text size
     *
     * @param  {string}          value   small or normal
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  size(value) {
    if (value === 'small') {
      value = 0x01;
    } else {
      value = 0x00;
    }

    this._queue([
      0x1b, 0x4d, value,
    ]);

    return this;
  }

  /**
     * Change text alignment
     *
     * @param  {string}          value   left, center or right
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  align(value) {
    const alignments = {
      'left': 0x00,
      'center': 0x01,
      'right': 0x02,
    };

    if (value in alignments) {
      this._state.align = value;

      if (!this._embedded) {
        this._queue([
          0x1b, 0x61, alignments[value],
        ]);
      }
    } else {
      throw new Error('Unknown alignment');
    }

    return this;
  }

  /**
     * Insert a table
     *
     * @param  {array}           columns  The column definitions
     * @param  {array}           data     Array containing rows. Each row is an array containing cells.
     *                                    Each cell can be a string value, or a callback function.
     *                                    The first parameter of the callback is the encoder object on
     *                                    which the function can call its methods.
     * @return {object}                   Return the object, for easy chaining commands
     *
     */
  table(columns, data) {
    if (this._cursor != 0) {
      this.newline();
    }

    for (let r = 0; r < data.length; r++) {
      const lines = [];
      let maxLines = 0;

      for (let c = 0; c < columns.length; c++) {
        const cell = [];

        if (typeof data[r][c] === 'string') {
          const w = linewrap(columns[c].width, {lineBreak: '\n'});
          const fragments = w(data[r][c]).split('\n');

          for (let f = 0; f < fragments.length; f++) {
            if (columns[c].align == 'right') {
              cell[f] = this._encode(fragments[f].padStart(columns[c].width));
            } else {
              cell[f] = this._encode(fragments[f].padEnd(columns[c].width));
            }
          }
        }

        if (typeof data[r][c] === 'function') {
          const columnEncoder = new EscPosEncoder(Object.assign({}, this._options, {
            width: columns[c].width,
            embedded: true,
          }));

          columnEncoder._codepage = this._codepage;
          columnEncoder.align(columns[c].align);
          data[r][c](columnEncoder);
          const encoded = columnEncoder.encode();

          let fragment = [];

          for (let e = 0; e < encoded.byteLength; e++) {
            if (e < encoded.byteLength - 1) {
              if (encoded[e] === 0x0a && encoded[e + 1] === 0x0d) {
                cell.push(fragment);
                fragment = [];

                e++;
                continue;
              }
            }

            fragment.push(encoded[e]);
          }

          if (fragment.length) {
            cell.push(fragment);
          }
        }

        maxLines = Math.max(maxLines, cell.length);
        lines[c] = cell;
      }

      for (let c = 0; c < columns.length; c++) {
        if (lines[c].length < maxLines) {
          for (let p = lines[c].length; p < maxLines; p++) {
            let verticalAlign = 'top';
            if (typeof columns[c].verticalAlign !== 'undefined') {
              verticalAlign = columns[c].verticalAlign;
            }

            if (verticalAlign == 'bottom') {
              lines[c].unshift((new Array(columns[c].width)).fill(0x20));
            } else {
              lines[c].push((new Array(columns[c].width)).fill(0x20));
            }
          }
        }
      }

      for (let l = 0; l < maxLines; l++) {
        for (let c = 0; c < columns.length; c++) {
          if (typeof columns[c].marginLeft !== 'undefined') {
            this.raw((new Array(columns[c].marginLeft)).fill(0x20));
          }

          this.raw(lines[c][l]);

          if (typeof columns[c].marginRight !== 'undefined') {
            this.raw((new Array(columns[c].marginRight)).fill(0x20));
          }
        }

        this.newline();
      }
    }

    return this;
  }

  /**
     * Insert a horizontal rule
     *
     * @param  {object}          options  And object with the following properties:
     *                                    - style: The style of the line, either single or double
     *                                    - width: The width of the line, by default the width of the paper
     * @return {object}                   Return the object, for easy chaining commands
     *
     */
  rule(options) {
    options = Object.assign({
      style: 'single',
      width: this._options.width || 10,
    }, options || {});

    this._queue([
      0x1b, 0x74, this._getCodepageIdentifier('cp437'),
      (new Array(options.width)).fill(options.style === 'double' ? 0xcd : 0xc4),
    ]);

    this._queue([
      0x1b, 0x74, this._state.codepage,
    ]);

    this.newline();

    return this;
  }

  /**
     * Insert a box
     *
     * @param  {object}           options   And object with the following properties:
     *                                      - style: The style of the border, either single or double
     *                                      - width: The width of the box, by default the width of the paper
     *                                      - marginLeft: Space between the left border and the left edge
     *                                      - marginRight: Space between the right border and the right edge
     *                                      - paddingLeft: Space between the contents and the left border of the box
     *                                      - paddingRight: Space between the contents and the right border of the box
     * @param  {string|function}  contents  A string value, or a callback function.
     *                                      The first parameter of the callback is the encoder object on
     *                                      which the function can call its methods.
     * @return {object}                     Return the object, for easy chaining commands
     *
     */
  box(options, contents) {
    options = Object.assign({
      style: 'single',
      width: this._options.width || 30,
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: 0,
      paddingRight: 0,
    }, options || {});

    let elements;

    if (options.style == 'double') {
      elements = [0xc9, 0xbb, 0xc8, 0xbc, 0xcd, 0xba]; // ╔╗╚╝═║
    } else {
      elements = [0xda, 0xbf, 0xc0, 0xd9, 0xc4, 0xb3]; // ┌┐└┘─│
    }

    if (this._cursor != 0) {
      this.newline();
    }

    this._restoreState();

    this._queue([
      0x1b, 0x74, this._getCodepageIdentifier('cp437'),
    ]);

    this._queue([
      new Array(options.marginLeft).fill(0x20),
      elements[0],
      new Array(options.width - 2).fill(elements[4]),
      elements[1],
      new Array(options.marginRight).fill(0x20),
    ]);

    this.newline();

    const cell = [];

    if (typeof contents === 'string') {
      const w = linewrap(options.width - 2 - options.paddingLeft - options.paddingRight, {lineBreak: '\n'});
      const fragments = w(contents).split('\n');

      for (let f = 0; f < fragments.length; f++) {
        if (options.align == 'right') {
          cell[f] = this._encode(fragments[f].padStart(options.width - 2 - options.paddingLeft - options.paddingRight));
        } else {
          cell[f] = this._encode(fragments[f].padEnd(options.width - 2 - options.paddingLeft - options.paddingRight));
        }
      }
    }

    if (typeof contents === 'function') {
      const columnEncoder = new EscPosEncoder(Object.assign({}, this._options, {
        width: options.width - 2 - options.paddingLeft - options.paddingRight,
        embedded: true,
      }));

      columnEncoder._codepage = this._codepage;
      columnEncoder.align(options.align);
      contents(columnEncoder);
      const encoded = columnEncoder.encode();

      let fragment = [];

      for (let e = 0; e < encoded.byteLength; e++) {
        if (e < encoded.byteLength - 1) {
          if (encoded[e] === 0x0a && encoded[e + 1] === 0x0d) {
            cell.push(fragment);
            fragment = [];

            e++;
            continue;
          }
        }

        fragment.push(encoded[e]);
      }

      if (fragment.length) {
        cell.push(fragment);
      }
    }

    for (let c = 0; c < cell.length; c++) {
      this._queue([
        new Array(options.marginLeft).fill(0x20),
        elements[5],
        new Array(options.paddingLeft).fill(0x20),
      ]);

      this._queue([
        cell[c],
      ]);

      this._restoreState();

      this._queue([
        0x1b, 0x74, this._getCodepageIdentifier('cp437'),
      ]);

      this._queue([
        new Array(options.paddingRight).fill(0x20),
        elements[5],
        new Array(options.marginRight).fill(0x20),
      ]);

      this.newline();
    }

    this._queue([
      new Array(options.marginLeft).fill(0x20),
      elements[2],
      new Array(options.width - 2).fill(elements[4]),
      elements[3],
      new Array(options.marginRight).fill(0x20),
    ]);

    this._restoreState();

    this.newline();

    return this;
  }

  /**
     * Barcode
     *
     * @param  {string}           value  the value of the barcode
     * @param  {string}           symbology  the type of the barcode
     * @param  {number}           height  height of the barcode
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  barcode(value, symbology, height) {
    if (this._embedded) {
      throw new Error('Barcodes are not supported in table cells or boxes');
    }

    const symbologies = {
      'upca': 0x00,
      'upce': 0x01,
      'ean13': 0x02,
      'ean8': 0x03,
      'code39': 0x04,
      'coda39': 0x04, /* typo, leave here for backwards compatibility */
      'itf': 0x05,
      'codabar': 0x06,
      'code93': 0x48,
      'code128': 0x49,
      'gs1-128': 0x50,
      'gs1-databar-omni': 0x51,
      'gs1-databar-truncated': 0x52,
      'gs1-databar-limited': 0x53,
      'gs1-databar-expanded': 0x54,
      'code128-auto': 0x55,
    };

    if (symbology in symbologies) {
      const bytes = CodepageEncoder.encode(value, 'ascii');

      if (this._cursor != 0) {
        this.newline();
      }

      this._queue([
        0x1d, 0x68, height,
        0x1d, 0x77, symbology === 'code39' ? 0x02 : 0x03,
      ]);

      if (symbology == 'code128' && bytes[0] !== 0x7b) {
        /* Not yet encodeded Code 128, assume data is Code B, which is similar to ASCII without control chars */

        this._queue([
          0x1d, 0x6b, symbologies[symbology],
          bytes.length + 2,
          0x7b, 0x42,
          bytes,
        ]);
      } else if (symbologies[symbology] > 0x40) {
        /* Function B symbologies */

        this._queue([
          0x1d, 0x6b, symbologies[symbology],
          bytes.length,
          bytes,
        ]);
      } else {
        /* Function A symbologies */

        this._queue([
          0x1d, 0x6b, symbologies[symbology],
          bytes,
          0x00,
        ]);
      }
    } else {
      throw new Error('Symbology not supported by printer');
    }

    this._flush();

    return this;
  }

  /**
     * QR code
     *
     * @param  {string}           value  the value of the qr code
     * @param  {number}           model  model of the qrcode, either 1 or 2
     * @param  {number}           size   size of the qrcode, a value between 1 and 8
     * @param  {string}           errorlevel  the amount of error correction used, either 'l', 'm', 'q', 'h'
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  qrcode(value, model, size, errorlevel) {
    if (this._embedded) {
      throw new Error('QR codes are not supported in table cells or boxes');
    }

    /* Force printing the print buffer and moving to a new line */

    this._queue([
      0x0a,
    ]);

    /* Model */

    const models = {
      1: 0x31,
      2: 0x32,
    };

    if (typeof model === 'undefined') {
      model = 2;
    }

    if (model in models) {
      this._queue([
        0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, models[model], 0x00,
      ]);
    } else {
      throw new Error('Model must be 1 or 2');
    }

    /* Size */

    if (typeof size === 'undefined') {
      size = 6;
    }

    if (typeof size !== 'number') {
      throw new Error('Size must be a number');
    }

    if (size < 1 || size > 8) {
      throw new Error('Size must be between 1 and 8');
    }

    this._queue([
      0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, size,
    ]);

    /* Error level */

    const errorlevels = {
      'l': 0x30,
      'm': 0x31,
      'q': 0x32,
      'h': 0x33,
    };

    if (typeof errorlevel === 'undefined') {
      errorlevel = 'm';
    }

    if (errorlevel in errorlevels) {
      this._queue([
        0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, errorlevels[errorlevel],
      ]);
    } else {
      throw new Error('Error level must be l, m, q or h');
    }

    /* Data */

    const bytes = CodepageEncoder.encode(value, 'iso88591');
    const length = bytes.length + 3;

    this._queue([
      0x1d, 0x28, 0x6b, length % 0xff, length / 0xff, 0x31, 0x50, 0x30, bytes,
    ]);

    /* Print QR code */

    this._queue([
      0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30,
    ]);

    this._flush();

    return this;
  }

  /**
     * Image
     *
     * @param  {object}         element  an element, like a canvas or image that needs to be printed
     * @param  {number}         width  width of the image on the printer
     * @param  {number}         height  height of the image on the printer
     * @param  {string}         algorithm  the dithering algorithm for making the image black and white
     * @param  {number}         threshold  threshold for the dithering algorithm
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  image(element, width, height, algorithm, threshold) {
    if (this._embedded) {
      throw new Error('Images are not supported in table cells or boxes');
    }

    if (width % 8 !== 0) {
      throw new Error('Width must be a multiple of 8');
    }

    if (height % 8 !== 0) {
      throw new Error('Height must be a multiple of 8');
    }

    if (typeof algorithm === 'undefined') {
      algorithm = 'threshold';
    }

    if (typeof threshold === 'undefined') {
      threshold = 128;
    }

    const canvas$1 = canvas.createCanvas(width, height);
    const context = canvas$1.getContext('2d');
    context.drawImage(element, 0, 0, width, height);
    let image = context.getImageData(0, 0, width, height);

    image = Flatten.flatten(image, [0xff, 0xff, 0xff]);

    switch (algorithm) {
      case 'threshold': image = Dither.threshold(image, threshold); break;
      case 'bayer': image = Dither.bayer(image, threshold); break;
      case 'floydsteinberg': image = Dither.floydsteinberg(image); break;
      case 'atkinson': image = Dither.atkinson(image); break;
    }

    const getPixel = (x, y) => x < width && y < height ? (image.data[((width * y) + x) * 4] > 0 ? 0 : 1) : 0;

    const getColumnData = (width, height) => {
      const data = [];

      for (let s = 0; s < Math.ceil(height / 24); s++) {
        const bytes = new Uint8Array(width * 3);

        for (let x = 0; x < width; x++) {
          for (let c = 0; c < 3; c++) {
            for (let b = 0; b < 8; b++) {
              bytes[(x * 3) + c] |= getPixel(x, (s * 24) + b + (8 * c)) << (7 - b);
            }
          }
        }

        data.push(bytes);
      }

      return data;
    };

    const getRowData = (width, height) => {
      const bytes = new Uint8Array((width * height) >> 3);

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x = x + 8) {
          for (let b = 0; b < 8; b++) {
            bytes[(y * (width >> 3)) + (x >> 3)] |= getPixel(x + b, y) << (7 - b);
          }
        }
      }

      return bytes;
    };


    if (this._cursor != 0) {
      this.newline();
    }

    /* Encode images with ESC * */

    if (this._options.imageMode == 'column') {
      this._queue([
        0x1b, 0x33, 0x24,
      ]);

      getColumnData(width, height).forEach((bytes) => {
        this._queue([
          0x1b, 0x2a, 0x21,
          (width) & 0xff, (((width) >> 8) & 0xff),
          bytes,
          0x0a,
        ]);
      });

      this._queue([
        0x1b, 0x32,
      ]);
    }

    /* Encode images with GS v */

    if (this._options.imageMode == 'raster') {
      this._queue([
        0x1d, 0x76, 0x30, 0x00,
        (width >> 3) & 0xff, (((width >> 3) >> 8) & 0xff),
        height & 0xff, ((height >> 8) & 0xff),
        getRowData(width, height),
      ]);
    }

    this._flush();

    return this;
  }

  /**
     * Cut paper
     *
     * @param  {string}          value   full or partial. When not specified a full cut will be assumed
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  cut(value) {
    if (this._embedded) {
      throw new Error('Cut is not supported in table cells or boxes');
    }

    let data = 0x00;

    if (value == 'partial') {
      data = 0x01;
    }

    this._queue([
      0x1d, 0x56, data,
    ]);

    return this;
  }

  /**
     * Pulse
     *
     * @param  {number}          device  0 or 1 for on which pin the device is connected, default of 0
     * @param  {number}          on      Time the pulse is on in milliseconds, default of 100
     * @param  {number}          off     Time the pulse is off in milliseconds, default of 500
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  pulse(device, on, off) {
    if (this._embedded) {
      throw new Error('Pulse is not supported in table cells or boxes');
    }

    if (typeof device === 'undefined') {
      device = 0;
    }

    if (typeof on === 'undefined') {
      on = 100;
    }

    if (typeof off === 'undefined') {
      off = 500;
    }

    on = Math.min(500, Math.round(on / 2));
    off = Math.min(500, Math.round(off / 2));

    this._queue([
      0x1b, 0x70, device ? 1 : 0, on & 0xff, off & 0xff,
    ]);

    return this;
  }

  /**
     * Add raw printer commands
     *
     * @param  {array}           data   raw bytes to be included
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  raw(data) {
    this._queue(data);

    return this;
  }

  /**
     * Encode all previous commands
     *
     * @return {Uint8Array}         Return the encoded bytes
     *
     */
  encode() {
    this._flush();

    let length = 0;

    this._buffer.forEach((item) => {
      if (typeof item === 'number') {
        length++;
      } else {
        length += item.length;
      }
    });

    const result = new Uint8Array(length);

    let index = 0;

    this._buffer.forEach((item) => {
      if (typeof item === 'number') {
        result[index] = item;
        index++;
      } else {
        result.set(item, index);
        index += item.length;
      }
    });

    this._reset();

    return result;
  }
}

module.exports = EscPosEncoder;
