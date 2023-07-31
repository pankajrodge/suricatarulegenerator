export const action = `
<b><u>Action :</u></b><br>
<img width="400" height="200" src="../assets/images/action.png" alt="Image"> 
    `;

export const source_ip = `
<b><u>Source IP/Network :</u></b><br>
With the source and destination, you specify the source of the traffic and the destination of the traffic, respectively. 
You can assign IP addresses, (both IPv4 and IPv6 are supported) and IP ranges. These can be combined with operators:

<img width="400" height="200" src="../assets/images/ip1.png" alt="Image"> <br><br>

Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/ip2.png" alt="Image"> <br><br>
`

export const destination_ip = `
<b><u>Destination IP/Network :</u></b><br>
With the source and destination, you specify the source of the traffic and the destination of the traffic, respectively. 
You can assign IP addresses, (both IPv4 and IPv6 are supported) and IP ranges. These can be combined with operators:
<img width="400" height="200" src="../assets/images/ip1.png" alt="Image"> <br><br>

Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/ip2.png" alt="Image"> <br><br>
`
export const pcre = `
<b><u>pcre :</u></b><br>
The keyword pcre matches specific on regular expressions. <br>
More information about regular expressions can be found here http://en.wikipedia.org/wiki/Regular_expression.
<br><br>
Format of pcre: <br>
pcre:"/&lt;regex&gt;/opts"; <br>

Example of pcre. In this example there will be a match if the payload contains six numbers following: <br><br>
pcre:"/[0-9]{6}/";
<br>
There are a few qualities of pcre which can be modified:<br>
<ul>
<li>By default pcre is case-sensitive.</li>
<li>The . (dot) is a part of regex. It matches on every byte except for newline characters.</li>
<li>By default the payload will be inspected as one line.</li>
</ul>

<br><br>
These qualities can be modified with the following characters: <br>
i    pcre is case insensitive<br>
s    pcre does check newline characters<br>
m    can make one line (of the payload) count as two lines<br>

<br> 
These options are perl compatible modifiers. To use these modifiers, you should d  \

The checksums will be recalculated by Suricata and changed after the replace keyword is being used.
`

export const source_port = `
<b><u>Source Port:</u></b><br>
Traffic comes in and goes out through ports. Different protocols have different port numbers. 
For example, the default port for HTTP is 80 while 443 is typically the port for HTTPS. 
Note, however, that the port does not dictate which protocol is used in the communication. 
Rather, it determines which application is receiving the data. <br><br>

The ports mentioned above are typically the destination ports. Source ports, i.e. the application that sent the packet,
typically get assigned a random port by the operating system.
When writing a rule for your own HTTP service, you would typically write any -> 80, 
since that would mean any packet from any source port to your HTTP application (running on port 80) is matched.<br><br>

In setting ports you can make use of special operators as well. Operators such as: <br><br>
<img width="400" height="200" src="../assets/images/port1.png" alt="Image"> <br><br>
Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/port2.png" alt="Image"> <br><br>
`

export const destination_port = `
<b><u>Destination Port:</u></b><br>
Traffic comes in and goes out through ports. Different protocols have different port numbers. 
For example, the default port for HTTP is 80 while 443 is typically the port for HTTPS. 
Note, however, that the port does not dictate which protocol is used in the communication. 
Rather, it determines which application is receiving the data. <br><br>

The ports mentioned above are typically the destination ports. Source ports, i.e. the application that sent the packet,
typically get assigned a random port by the operating system.
When writing a rule for your own HTTP service, you would typically write any -> 80, 
since that would mean any packet from any source port to your HTTP application (running on port 80) is matched.<br><br>

In setting ports you can make use of special operators as well. Operators such as: <br><br>
<img width="400" height="200" src="../assets/images/port1.png" alt="Image"> <br><br>
Rule usage examples: <br><br>
<img width="400" height="200" src="../assets/images/port2.png" alt="Image"> <br><br>
`

export const flow_direction = `
<b><u>Flow Direction :</u></b><br>
Direction can be single or both. When it is single it is always from source to destination. 
When we want to match traffic from both source to destination and vice-versa, both will be used
`

export const msg=`
<b><u>Alert Message :</u></b><br>
The keyword msg gives contextual information about the signature and the possible alert.
`

export const sid = `
<b><u>Signature ID :</u></b><br>
The keyword sid gives every signature its own id. This id is stated with a number greater than zero.
`

export const rev = `
<b><u>Revision Number :</u></b><br>
The Signature keyword is commonly accompanied by the Revision keyword.
If a signature is modified, the number of rev will be incremented by the signature writers. 
`
export const flow = `
The flow keyword can be used to match on direction of the flow, so to/from client or to/from server. 
It can also match if the flow is established or not. 
The flow keyword can also be used to say the signature has to match on stream only (only_stream) or on packet only (no_stream).
<br><br>
So with the flow keyword you can match on:
<br><br>
to_client:<br>
Match on packets from server to client.
<br><br>

to_server:<br>
Match on packets from client to server.
<br><br>

from_client:<br>
Match on packets from client to server (same as to_server).
<br><br>

from_server:<br>
Match on packets from server to client (same as to_client).
<br><br>

established:<br>
Match on established connections.
<br><br>

not_established:<br>
Match on packets that are not part of an established connection.
<br><br>

stateless:<br>
Match on packets that are and are not part of an established connection.
<br><br>

only_stream:<br>
Match on packets that have been reassembled by the stream engine.
<br><br>

no_stream:<br>
Match on packets that have not been reassembled by the stream engine. Will not match packets that have been reassembled.
<br><br>

only_frag:<br>
Match packets that have been reassembled from fragments.
<br><br>

no_frag:<br>
Match packets that have not been reassembled from fragments.
<br><br>

Multiple flow options can be combined.<br><br>

The determination of established depends on the protocol:<br>
For TCP a connection will be established after a three way handshake.<br>
For other protocols (for example UDP), the connection will be considered established after seeing traffic from both sides of the connection.
`

export const offset=`
<b><u>offset:</u></b><br>
The offset keyword designates from which byte in the payload will be checked to find a match. 
For instance offset:3; checks the fourth byte and further. So if payload is abcdef then offset:3 match the content from character d onwords. Value must be numeric`

export const nocase=`
<b><u>nocase:</u></b><br>
If you do not want to make a distinction between uppercase and lowercase characters, you can use nocase.
`

export const depth=`
<b><u>depth:</u></b><br>
The depth content modifier comes with a mandatory numeric value, like: <br><br>
depth:3 <br><br>
The number after depth designates how many bytes from the beginning of the payload will be checked. <br>
So if payload is abcdef then depth:3 will match abc in the content string`

export const startswith=`
<b><u>startswith:</u></b><br>
The startswith keyword is similar to depth. It takes no arguments and must follow a content keyword. It modifies the content to match exactly at the start of a buffer.
<br><br>
Example: 
<br>
content:"GET|20|"; startswith; <br><br>
startswith is a short hand notation for: <br><br>
content:"GET|20|"; depth:4; offset:0;<br><br>
startswith cannot be mixed with depth, offset, within or distance for the same pattern.
`
export const endswith=`
<b><u>endswith:</u></b><br>
It takes no arguments and must follow a content keyword. It modifies the content to match exactly at the end of a buffer.<br><br>
Example:<br><br>
content:".php"; endswith;
<br><br>
endswith cannot be mixed with offset, within or distance for the same pattern.
`

export const distance=`
<b><u>distance:</u></b><br>
The keyword distance is a relative content modifier. This means it indicates a relation between this content keyword and the content preceding it. 
Distance has its influence after the preceding match. The keyword distance comes with a mandatory numeric value. The value you give distance, 
determines the byte in the payload from which will be checked for a match relative to the previous match.<br>
So, distance:5; means the pattern can be anywhere after the previous match + 5 bytes. <br>
The absolute value for distance must be less than or equal to 1MB (1048576). <br><br>

Examples of distance: <br><br>

<img width="300" height="200" src="../assets/images/distance.png" alt="Image"> <br><br>

<b><font color="red">Note: To create rule with distance keyword, add the first content without content modifier and then add the second content with distance modifier</font></b>
`

export const within=`
<b><u>within:</u></b><br>
The keyword within is relative to the preceding match. The keyword within comes with a mandatory numeric value. 
Using within makes sure there will only be a match if the content matches with the payload within the set amount of bytes. <b>Within can not be 0 (zero)</b>
<br>
The absolute value for within must be less than or equal to 1MB (1048576).
<br>
Example:<br><br>
<img width="350" height="150" src="../assets/images/within1.png" alt="Image"> <br><br>
Example of matching with within: <br><br>
<img width="350" height="150" src="../assets/images/within2.png" alt="Image"> <br><br>
The distance and within can be very well combined in a signature. If you want Suricata to check a specific part of the payload for a match, use within.<br><br>
<img width="350" height="350" src="../assets/images/within3.png" alt="Image"> <br><br>

<b><font color="red">Note: To create rule with distance keyword, add the first content without content modifier and then add the second content with within modifier</font></b>
`

export const isdataat=`
<b><u>isdataat:</u></b><br>
The purpose of the isdataat keyword is to look if there is still data at a specific part of the payload. 
The keyword starts with a number (the position) and then optional followed by 'relative'.
You use the option 'relative' to know if there is still data at a specific part of the payload relative to the last match.
<br>
Example:<br><br>

isdataat:512;<br>
isdataat:50, relative;<br>

<img width="300" height="200" src="../assets/images/isdataat.png" alt="Image"> <br><br>
`

export const bsize=`
<b><u>bsize:</u></b><br>
With the bsize keyword, you can match on the length of the buffer. 
<br><br>An optional operator can be specified; if no operator is present, the operator will default to '='. 
When a relational operator is used, e.g., '<', '>' or '<>' (range), the bsize value will be compared using the relational operator. Ranges are inclusive.
<br><br>If one or more content keywords precedes bsize, each occurrence of content will be inspected and an error will be raised if the content length and the bsize value prevent a match.
<br><br>
Format:
<br><br>
bsize:<number>;<br>
bsize:=<number>;<br>
bsize:<<number>;<br>
bsize:><number>;<br>
bsize:<lo-number><><hi-number>;<br>
`

export const dsize=`
<b><u>dsize:</u></b><br>
With the dsize keyword, you can match on the size of the packet payload/data. 
You can use the keyword for example to look for abnormal sizes of payloads which are equal to some n i.e. 'dsize:n'
This may be convenient in detecting buffer overflows.<br>

dsize cannot be used when using app/streamlayer protocol keywords (i.e. http.uri)<br><br>
Format:<br><br>
dsize:[<>]number; || dsize:min<>max;<br>
`

export const byte_test=`
<b><u>byte_test:</u></b><br>
The byte_test keyword extracts <b>&lt;num of bytes&gt;</b> and performs an operation selected with <b>&lt;operator&gt;</b> against the value in <b>&lt;test value&gt;</b> at a particular 
<b>&lt;offset&gt;</b>. 
The <b>&lt;bitmask value&gt;</b> is applied to the extracted bytes 
(before the operator is applied), and the final result will be right shifted one bit for each trailing 0 in the <b>&lt;bitmask value&gt;</b>.
<br><br>Format:<br><br>

byte_test:<b>&lt;num of bytes&gt;</b>, [!]<b>&lt;operator&gt;</b>, <b>&lt;test value&gt;</b>, <b>&lt;offset&gt;</b> [,<b>&lt;relative&gt;</b>] \  
[,<b>&lt;endian&gt;</b>][, string, <b>&lt;num type&gt;</b>][, dce][, bitmask <b>&lt;bitmask value&gt;</b>];
<br>
<img width="500" height="500" src="../assets/images/byte_test2.png" alt="Image"> <br><br>
`
export const byte_math=`
<b><u>byte_math:</u></b><br>
The byte_math keyword adds the capability to perform mathematical operations on extracted values with an existing variable or a specified value.

When relative is included, there must be a previous content or pcre match.

Note: if oper is / and the divisor is 0, there will never be a match on the byte_math keyword.

The result can be stored in a result variable and referenced by other rule options later in the rule.<br><br>

<img width="400" height="200" src="../assets/images/bytemath1.png" alt="Image"> <br><br>

Format:<br><br>

byte_math:bytes &lt;num of bytes&gt; | &lt;variable-name&gt; , offset &lt;offset&gt;, oper &lt;operator&gt;, rvalue &lt;rvalue&gt;, \
      result &lt;result_var&gt; [, relative] [, endian &lt;endian&lt;] [, string &lt;number-type&gt;] \
      [, dce] [, bitmask &lt;value&gt;];

<br><br>
<img width="400" height="400" src="../assets/images/bytemath2.png" alt="Image"> <br><br>
`
export const http_header=`
With the http.header content modifier, it is possible to match specifically and only on the HTTP header buffer. This contains all of the extracted headers in a single buffer.
The modifier can be used in combination with other content modifiers, like depth, distance, offset, nocase and within
<br>Note: the header buffer is normalized. Any trailing whitespace and tab characters are removed.<br>
Example of a header in a HTTP request: <br><br>

<b>
GET / HTTP/1.1 <br>
Host: www.google.com <br>
Connection: keep-alive <br>
Accept: application/xml <br>
</b>
<br>
Example of the purpose of http.header: <br><br>
<img width="400" height="200" src="../assets/images/header2.png" alt="Image"> <br><br>
<img width="400" height="200" src="../assets/images/header3.png" alt="Image"> <br><br>
`