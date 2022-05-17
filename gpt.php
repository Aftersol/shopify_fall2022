<?php

# Based off code from: https://github.com/ldobreira/gpt3-php/blob/main/includes/Openai.php

$gpt_prompt = $_POST["prompt"];
$gpt_response = "";
$API_KEY = ''; # Post your API key here

$header = ['Content-Type: application/json'];
$postfields = ['prompt' => $gpt_prompt, 'temperature' => 0.9, 'max_tokens' => 100];

$ret_html = "";        

if ($gpt_prompt == "") # empty string sent to the server?
{
        $ret_html = '<p>Sorry, we cannot answer your prompt</p>';
        echo $ret_html;
}
else
{
        # Send packets to OpenAI API
        $curl_context = curl_init();

        curl_setopt_array($curl_context, [
                CURLOPT_URL => 'https://api.openai.com/v1/engines/text-curie-001/completions',
                CURLOPT_HTTPHEADER => $header,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_POST => true,
                CURLOPT_USERPWD => ":$API_KEY",
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_POSTFIELDS => json_encode($postfields),
                CURLOPT_RETURNTRANSFER => true
        ]
);


        $gpt_response = curl_exec($curl_context);
        $err = curl_error($curl_context);

        curl_close($curl_context);
        #echo $gpt_response;
        
        $gpt_response = json_decode($gpt_response);
        $answer = $gpt_response->choices[0]->text;
        
        if ($err)
        {
                $ret_html = "ERROR: ${err}";
        }
        else
        {
                $ret_html = $answer;
        }

        echo $ret_html;
}
?>